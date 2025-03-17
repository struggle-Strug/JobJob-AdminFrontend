import { Table, Button, Space, message, Modal } from "antd";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import { Link } from "react-router-dom";

import { Facilities } from "../../utils/constants/categories";
import { getJobValueByKey } from "../../utils/getFunctions";

const FacilityAllow = () => {
  const [allFacilities, setAllFacilities] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null); // Store the selected facility index
  const [isModalVisible, setIsModalVisible] = useState(false); // Control modal visibility

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
      render: (_, record, index) => (
        <a
          className="text-blue-500 hover:underline"
          onClick={() => handlePreview(index)}
        >
          プレビュー
        </a>
      ),
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
            onClick={() => handleAllow(record.facilityId, "allowed")}
          >
            掲載OK
          </Button>
          <Button
            className="bg-blue-100 text-blue-600 border-blue-200 hover:bg-blue-200"
            onClick={() => handleAllow(record.facilityId, "draft")}
          >
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

  const handleAllow = async (id, status) => {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/v1/facility/${id}/${status}`
    );
    if (response.data.error) return message.error(response.data.message);
    message.success(response.data.message);
    getFacilityData();
  };

  const handlePreview = (index) => {
    setSelectedIndex(index); // Set the selected facility index
    setIsModalVisible(true); // Show the modal
  };

  useEffect(() => {
    document.title = "施設調査";
    getFacilityData();
    window.scrollTo({ top: 0, behavior: "smooth" });
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

      {/* Modal for Preview */}
      <Modal
        title="施設プレビュー"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            閉じる
          </Button>,
        ]}
        width={800} // Adjust the width as needed
        className="modal"
      >
        {selectedIndex !== null && allFacilities[selectedIndex] ? (
          <div className="flex w-full p-8">
            <div className="container flex justify-between gap-8">
              <div className="flex flex-col items-start justify-start w-full">
                <div className="flex relative flex-col items-center justify-between bg-white rounded-2xl p-6 w-full shadow-2xl hover:scale-[1.02] duration-300">
                  <img
                    src={allFacilities[selectedIndex].photo[0]}
                    alt="arrow-down"
                    className="w-full rounded-lg aspect-video object-cover "
                  />
                  <div className="flex flex-col items-start justify-start p-4 w-full h-full gap-4">
                    <p className="lg:text-xl md:text-sm text-[#343434]">
                      <span className="lg:text-2xl md:text-xl font-bold">
                        {allFacilities[selectedIndex].name}
                      </span>
                      <span className="text-base">の求人情報</span>
                    </p>
                    <div>
                      <p className="lg:text-sm md:text-xs text-[#343434]">
                        {allFacilities[selectedIndex].prefecture}
                        {allFacilities[selectedIndex].city}
                        {allFacilities[selectedIndex].village}
                        {allFacilities[selectedIndex].building}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col bg-white px-4 rounded-lg mt-8 w-full">
                  <p className="lg:text-lg font-bold text-sm text-[#343434] border-b-[1px] py-6 border-[#e7e7e7]">
                    事業所情報
                  </p>
                  <div className="flex items-start justify-start border-b-[1px] py-6 border-[#e7e7e7]">
                    <p className="lg:text-base text-sm font-bold text-[#343434] w-1/5">
                      法人・施設名
                    </p>
                    <Link
                      to={`/facility/${allFacilities[selectedIndex].facility_id}`}
                      className="lg:text-base text-sm text-[#FF2A3B] hover:underline w-4/5"
                    >
                      {allFacilities[selectedIndex].name}
                    </Link>
                  </div>
                  <div className="flex items-start justify-start border-b-[1px] py-6 border-[#e7e7e7]">
                    <p className="lg:text-base text-sm font-bold text-[#343434] w-1/5">
                      募集職種
                    </p>
                    <div className="flex flex-col items-start, justify-start w-4/5">
                      {allFacilities[selectedIndex].jobPosts?.map(
                        (jobPost, index) => {
                          return (
                            <Link
                              key={index}
                              to={`/${getJobValueByKey(jobPost.type)}/details/${
                                jobPost?.jobpost_id
                              }`}
                              className="lg:text-base text-sm text-[#FF2A3B] hover:underline"
                            >
                              {jobPost?.type}({jobPost?.employment_type})
                            </Link>
                          );
                        }
                      )}
                    </div>
                  </div>
                  <div className="flex items-start justify-start border-b-[1px] py-6 border-[#e7e7e7]">
                    <p className="lg:text-base text-sm font-bold text-[#343434] w-1/5">
                      施設紹介
                    </p>
                    <p className="lg:text-base text-sm text-[#343434] w-4/5">
                      <pre>{allFacilities[selectedIndex].introduction}</pre>
                    </p>
                  </div>
                  <div className="flex items-start justify-start border-b-[1px] py-6 border-[#e7e7e7]">
                    <p className="lg:text-base text-sm font-bold text-[#343434] w-1/5">
                      アクセス
                    </p>
                    <div className="flex flex-col items-start justify-start w-4/5">
                      <div className="inline-block items-start justify-start gap-2">
                        {allFacilities[selectedIndex].access.map(
                          (item, index) => {
                            return (
                              <div
                                key={index}
                                className="inline-block  text-center bg-[#F5BD2E] text-white m-1 px-2 py-1 rounded-lg"
                              >
                                <p className="lg:text-[0.7rem] md:text-[0.6rem] font-bold">
                                  {item}
                                </p>
                              </div>
                            );
                          }
                        )}
                      </div>
                      <p className="lg:text-base text-sm text-[#343434] mt-1">
                        {allFacilities[selectedIndex].prefecture}
                        {allFacilities[selectedIndex].city}
                        {allFacilities[selectedIndex].village}
                        {allFacilities[selectedIndex].building}
                      </p>
                      <div className="w-full py-4 aspect-square">
                        <iframe
                          title="Google Map"
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          loading="lazy"
                          allowFullScreen
                          src={`https://www.google.com/maps?q=${allFacilities[selectedIndex].prefecture}${allFacilities[selectedIndex].city}${allFacilities[selectedIndex].village}${allFacilities[selectedIndex].building}&output=embed`}
                        ></iframe>
                      </div>
                      <p className="lg:text-base text-sm text-[#343434] mt-1">
                        {allFacilities[selectedIndex].access_text}
                      </p>
                      <Link
                        to={`https://www.google.com/maps?q=${encodeURIComponent(
                          `${allFacilities[selectedIndex].prefecture}${allFacilities[selectedIndex].city}${allFacilities[selectedIndex].village}${allFacilities[selectedIndex].building}`
                        )}`}
                        target="_blank"
                        className="lg:text-base text-sm text-[#FF2A3B] hover:underline mt-1 border-[1px] border-[#FF2A3B] py-1 px-2 rounded-lg"
                      >
                        Google Mapsで見る
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-start justify-start border-b-[1px] py-6 border-[#e7e7e7]">
                    <p className="lg:text-base text-sm font-bold text-[#343434] w-1/5">
                      設立年月日
                    </p>
                    <p className="lg:text-base text-sm text-[#343434] w-4/5">
                      {
                        allFacilities[selectedIndex].establishment_date.split(
                          "-"
                        )[0]
                      }
                      年
                      {
                        allFacilities[selectedIndex].establishment_date.split(
                          "-"
                        )[1]
                      }
                      日
                    </p>
                  </div>
                  <div className="flex items-start justify-start border-b-[1px] py-6 border-[#e7e7e7]">
                    <p className="lg:text-base text-sm font-bold text-[#343434] w-1/5">
                      施設
                    </p>
                    <div className="flex flex-col items-start justify-start w-4/5">
                      <Link
                        to={`/${
                          Facilities[
                            allFacilities[selectedIndex].facility_genre
                          ]
                        }`}
                        className="lg:text-base text-sm text-[#FF2A3B] hover:underline"
                      >
                        {allFacilities[selectedIndex].facility_genre}
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-start justify-start border-b-[1px] py-6 border-[#e7e7e7]">
                    <p className="lg:text-base text-sm font-bold text-[#343434] w-1/5">
                      営業時間
                    </p>
                    <p className="lg:text-base text-sm text-[#343434] w-4/5">
                      <pre>{allFacilities[selectedIndex].service_time}</pre>
                    </p>
                  </div>
                  <div className="flex items-start justify-start py-6">
                    <p className="lg:text-base text-sm font-bold text-[#343434] w-1/5">
                      休日
                    </p>
                    <p className="lg:text-base text-sm text-[#343434] w-4/5">
                      <pre>{allFacilities[selectedIndex].rest_day}</pre>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </Modal>
    </div>
  );
};

export default FacilityAllow;
