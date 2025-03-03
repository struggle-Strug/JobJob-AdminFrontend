import { Table, Button, Space, message } from "antd";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import moment from "moment";

const FacilityAllow = () => {
  const [allFacilities, setAllFacilities] = useState([]);
  const columns = [
    {
      title: "申請日",
      dataIndex: "applicationDate",
      key: "applicationDate",
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
      title: "法人ID",
      dataIndex: "corporationId",
      key: "corporationId",
      width: 120,
    },
    {
      title: "プレビュー",
      dataIndex: "preview",
      key: "preview",
      render: () => <a className="text-blue-500 hover:underline">プレビュー</a>,
      width: 100,
    },
    {
      title: "審査",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            className="bg-blue-100 text-blue-600 border-blue-200 hover:bg-blue-200"
            onClick={() => handleAllow(record.facilityId)}
          >
            掲載OK
          </Button>
          <Button className="bg-blue-100 text-blue-600 border-blue-200 hover:bg-blue-200">
            差し戻し
          </Button>
        </Space>
      ),
      width: 200,
    },
  ];

  const getFacilityData = useCallback(async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/v1/facility/all`
    );
    setAllFacilities(
      response.data.facility.filter(
        (facility) => facility.allowed === "pending"
      )
    );
  }, []);

  const data = allFacilities?.map((facility) => ({
    id: facility._id,
    applicationDate: moment(facility.created_at).format("YYYY/MM/DD"),
    facilityName: facility.name,
    facilityId: facility.facility_id,
    corporationId: facility.customer_id,
  }));

  const handleAllow = async (id) => {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/v1/facility/${id}/allowed`
    );
    if (response.data.error) return message.error(response.data.message);
    message.success(response.data.message);
    getFacilityData();
  };
  useEffect(() => {
    document.title = "施設調査";
    getFacilityData();
  }, []);
  return (
    <div className="min-h-screen p-6">
      <p className="lg:text-2xl md:text-xl text-lg font-bold text-[#343434]">
        施設審査
      </p>
      <div className="p-4 mt-8">
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
  );
};

export default FacilityAllow;
