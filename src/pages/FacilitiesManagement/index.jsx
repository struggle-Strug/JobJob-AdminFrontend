import { useCallback, useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Button, Input, Table } from "antd";
import moment from "moment";
import axios from "axios";

const FacilitiesManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allFacilities, setAllFacilities] = useState([]);
  const [filteredFacilities, setFilteredFacilities] = useState([]); // State for filtered data

  // Table columns
  const columns = [
    {
      title: "登録日",
      dataIndex: "registrationDate",
      key: "registrationDate",
      width: 120,
    },
    {
      title: "施設名",
      dataIndex: "facilityName",
      key: "facilityName",
      width: 200,
    },
    {
      title: "施設ID",
      dataIndex: "facilityId",
      key: "facilityId",
      width: 120,
    },
    {
      title: "施設ジャンル",
      dataIndex: "facilityGenre",
      key: "facilityGenre",
      width: 120,
    },
    {
      title: "都道府県",
      dataIndex: "prefecture",
      key: "prefecture",
      width: 120,
    },
    {
      title: "市区町村",
      dataIndex: "city",
      key: "city",
      width: 120,
    },
    {
      title: "法人ID",
      dataIndex: "corporationId",
      key: "corporationId",
      width: 120,
    },
    {
      title: "公開求人数",
      dataIndex: "publicJobCount",
      key: "publicJobCount",
      width: 120,
    },
  ];

  // Prepare table data
  const data = filteredFacilities.map((facility, index) => ({
    key: index,
    registrationDate: moment(facility.registrationDate).format("YYYY/MM/DD"),
    facilityName: facility.name,
    facilityId: facility.facility_id,
    facilityGenre: facility.facility_genre,
    prefecture: facility.prefecture,
    city: facility.city,
    corporationId: facility.customer_id.customer_id,
    publicJobCount: facility.publicJobCount,
  }));

  // Fetch all facilities
  const getAllFacilities = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/facility/all`
      );
      const facilities = response.data.facility;
      setAllFacilities(facilities);
      setFilteredFacilities(
        facilities.filter((facility) => facility.allowed === "allowed")
      ); // Initially show all facilities
    } catch (error) {
      console.error("Error fetching facilities:", error);
    }
  }, []);

  // Handle search
  const handleSearch = () => {
    const filteredData = allFacilities.filter(
      (facility) =>
        facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        facility.facility_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFacilities(filteredData);
  };
  useEffect(() => {
    document.title = "施設管理";
    getAllFacilities();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen p-6">
      <p className="lg:text-2xl md:text-xl text-lg font-bold text-[#343434]">
        施設管理
      </p>
      <div className="p-4 mt-8">
        <div className="flex items-center gap-4 mb-6">
          <Input
            type="text"
            placeholder="検索"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button
            variant="secondary"
            className="bg-blue-100 text-blue-700 hover:bg-blue-200"
            onClick={handleSearch}
          >
            検索
          </Button>
          <Button variant="ghost" className="text-blue-600 hover:text-blue-800">
            <Download className="mr-2 h-4 w-4" />
            CSVダウンロード
          </Button>
        </div>
        <div className="flex gap-4 mb-6 text-sm">
          <span>すべて: {allFacilities.length}件</span>
          <span className="text-blue-600">
            掲載申請中:{" "}
            {
              allFacilities.filter((facility) => facility.allowed === "draft")
                .length
            }
            件
          </span>
          <span className="text-blue-600">
            掲載申請中:{" "}
            {
              allFacilities.filter((facility) => facility.allowed === "pending")
                .length
            }
            件
          </span>
          <span className="text-blue-600">
            掲載中:{" "}
            {
              allFacilities.filter((facility) => facility.allowed === "allowed")
                .length
            }
            件
          </span>
          <span className="text-blue-600">
            掲載終了:{" "}
            {
              allFacilities.filter((facility) => facility.allowed === "ended")
                .length
            }
            件
          </span>
        </div>

        <div className="border rounded-md">
          <Table
            columns={columns}
            dataSource={data}
            pagination={{
              pageSize: 20,
              position: ["bottomCenter"], // Center the pagination at the bottom
            }}
            bordered
            size="middle"
            className="[&_.ant-table-cell]:!whitespace-nowrap"
          />
        </div>
      </div>
    </div>
  );
};

export default FacilitiesManagement;
