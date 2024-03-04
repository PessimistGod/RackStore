import axios from "axios";
import React, { useEffect, useState } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import Loading from '../../Components/Loading';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

let CanvasJSChart = CanvasJSReact.CanvasJSChart;

const AdminHome = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [userLength, setUserLength] = useState(0);
  const [merchantLength, setMerchantLength] = useState(0);
  const [productLength, setProductLength] = useState(0);
  const [activeUser, setActiveUser] = useState(0);
  const [activeProduct, setActiveProduct] = useState(0);
  const [activeMerchant, setActiveMerchant] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      if (!decodedToken.isAdmin) {
        navigate('/login')
      }
    }
  }, [navigate])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        let response = await axios.get(`${API_URL}/api/user`);
        let filteredResponse = response.data.filter(
          ({ isAdmin, isMerchant }) => !isAdmin && !isMerchant
        );
        setUserLength(filteredResponse.length);
        setLoading(false)
      } catch (error) {
        console.log("Error fetching users:", error);
        setLoading(false)
      }
    };
    fetchUsers();
  }, [API_URL]);

  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        setLoading(true)
        let response = await axios.get(`${API_URL}/api/user`);
        let filteredResponse = response.data.filter(
          ({ isAdmin, isMerchant }) => !isAdmin && isMerchant
        );
        setMerchantLength(filteredResponse.length);
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.log("Error fetching merchants:", error);

      }
    };
    fetchMerchants();
  }, [API_URL]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        let response = await axios.get(`${API_URL}/api/prod/products`);
        const uniqueUserIds = new Set(response.data.map(product => String(product.userId)));
        setActiveMerchant((uniqueUserIds.size / merchantLength) * 100);
        setProductLength(response.data.length);
        setLoading(false)
      } catch (error) {
        console.log("Error fetching products:", error);
        setLoading(false)
      }
    };
    fetchProducts();
  }, [API_URL, merchantLength]);

  useEffect(() => {
    const analyseData = async () => {
      try {
        setLoading(true)
        let response = await axios.get(`${API_URL}/api/user/analyze-history`);
        if (response.data) {
          setActiveUser((response.data.uniqueUserIdsCount / userLength) * 100);
          setActiveProduct((response.data.uniqueProductIdsCount / productLength) * 100);
          setLoading(false);
        }
      } catch (error) {
        console.log("Error analysing data:", error);
        setLoading(false)
      }
    };
    analyseData();
  }, [API_URL, userLength, productLength]);

  const options = {
    animationEnabled: true,
    title: {
      text: "",
    },
    subtitles: [
      {
        text: "",
        verticalAlign: "center",
        fontSize: 24,
        dockInsidePlotArea: true,
      },
    ],
    data: [
      {
        type: "doughnut",
        showInLegend: true,
        indexLabel: "{name}: {y}%",
        yValueFormatString: "#,###'%'",
        dataPoints: [
          { name: "Active Products", y: parseFloat(activeProduct), color: "orange" },
          { name: "Active Users", y: parseFloat(activeUser), color: "green" },
          { name: "Active Merchants", y: parseFloat(activeMerchant), color: "purple" },
        ],
      },
    ],
  };

  return (
    <section>
      {loading ? (
        <Loading />
      ) : (
        <div className="max-w-full grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-12">
          {/* Users */}
          <div className="w-full col-span-1 sm:col-auto bg-white mt-4 shadow-lg rounded-lg p-8 px-12">
            <div className="flex flex-col justify-center items-center">
              <img className="w-12 h-12" src="./teamwork.png" alt="" />
            </div>
            <h3 className="text-md text-gray-600">Users</h3>
            <div className="text-red-500 py-4">{userLength}</div>
          </div>

          {/* Merchants */}
          <div className="w-full col-span-1 sm:col-auto bg-white mt-4 shadow-lg rounded-lg p-8 px-12">
            <div className="flex flex-col justify-center items-center">
              <img className="w-12 h-12" src="./cashier.png" alt="" />
            </div>
            <h3 className="text-md text-gray-600">Merchants</h3>
            <div className="text-red-500 py-4">{merchantLength}</div>
          </div>

          {/* Total Products */}
          <div className="w-full col-span-2 sm:col-auto bg-white mt-4 shadow-lg rounded-lg p-8 px-12">
            <div className="flex flex-col justify-center items-center">
              <img className="w-12 h-12" src="./products.png" alt="" />
            </div>
            <h3 className="text-md text-gray-600">Total Products</h3>
            <div className="text-red-500 py-4">{productLength}</div>
          </div>
        </div>
      )}

      {/* Doughnut Chart */}
      <div className="mt-12">
        {!loading && <CanvasJSChart options={options} />}
      </div>
    </section>
  );
};

export default AdminHome;
