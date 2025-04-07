import { Table, Button, Space, message, Modal, Carousel } from "antd";
import axios from "axios";
import { useCallback, useEffect, useState, useRef } from "react";
import moment from "moment";
import { Link } from "react-router-dom";

import { Facilities } from "../../utils/constants/categories";
import { getJobValueByKey } from "../../utils/getFunctions";

const FacilityAllow = () => {
  const [allFacilities, setAllFacilities] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null); // Store the selected facility index
  const [isModalVisible, setIsModalVisible] = useState(false); // Control modal visibility
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef();
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

  const [error, setError] = useState(null);

  const getFacilityData = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/facility/request`
      );
      setAllFacilities(
        response.data.facility.filter(
          (facility) => facility.allowed === "pending"
        )
      );
      setError(null); // 正常に取得できた場合、エラー状態をリセット
    } catch (error) {
      console.error("Error fetching facility data:", error);

      // error.response を使って、エラーのステータスに応じたメッセージを設定
      if (error.response) {
        if (error.response.status === 404) {
          setError("施設データが見つかりません。URLを確認してください。");
        } else {
          setError(
            `データ取得に失敗しました。ステータスコード: ${error.response.status}`
          );
        }
      } else {
        setError(
          "ネットワークエラーが発生しました。しばらくしてから再度お試しください。"
        );
      }
    }
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
    if (status === "allowed") {
      message.success("施設掲載OK成功");
    } else {
      message.success("施設差し戻し成功");
    }
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
                  <div className="relative w-full">
                    <Carousel
                      ref={carouselRef}
                      dots={false}
                      beforeChange={(_, next) => setCurrentSlide(next)}
                    >
                      {allFacilities[selectedIndex]?.photo?.length > 0 ? (
                        allFacilities[selectedIndex].photo.map(
                          (photoUrl, index) => (
                            <div key={index}>
                              <img
                                src={photoUrl}
                                alt={`facility-photo-${index}`}
                                className="w-full aspect-video object-cover rounded-t-xl"
                              />
                            </div>
                          )
                        )
                      ) : (
                        <div>
                          <img
                            src="/assets/images/noimage.png"
                            alt="no-image"
                            className="w-full aspect-video object-cover"
                          />
                        </div>
                      )}
                    </Carousel>
                    {/* スライドインジケーター（画像上に表示） */}
                    {allFacilities[selectedIndex]?.photo?.length > 0 && (
                      <div className="absolute top-2 right-2 bg-[#fdfcf9] text-black text-xs px-2 py-1 rounded-xl z-10 border border-[#ddccc9]">
                        {currentSlide + 1}/
                        {allFacilities[selectedIndex].photo.length}
                      </div>
                    )}
                  </div>
                  {/* 矢印バー：画像直下に隙間なく配置 */}

                  <div className="flex items-center justify-between w-full bg-[#fdfcf9]  h-11 rounded-b-xl border border-[#ddccc9]">
                    <button
                      onClick={() => {
                        const newIndex =
                          (currentSlide -
                            1 +
                            allFacilities[selectedIndex].photo.length) %
                          allFacilities[selectedIndex].photo.length;
                        carouselRef.current.goTo(newIndex, false);
                        setCurrentSlide(newIndex);
                      }}
                      className="bg-transparent text-[#FF6B56] border-r border-[#ddccc9] p-2 w-11 h-11 flex items-center justify-center "
                    >
                      <svg
                        aria-label="前の写真を表示"
                        class="h-[13px] border-b border-transparent transition-jm group-hover:border-jm-linkHover"
                        width="24"
                        height="24"
                        role="img"
                        aria-hidden="false"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11 13L5.27083 8L11 3"
                          stroke="#FF6B56"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        const newIndex =
                          (currentSlide + 1) %
                          allFacilities[selectedIndex].photo.length;
                        carouselRef.current.goTo(newIndex, false);
                        setCurrentSlide(newIndex);
                      }}
                      className="bg-transparent text-[#FF6B56] border-l border-[#ddccc9] p-2 w-11 h-11 flex items-center justify-center "
                    >
                      <svg
                        aria-label="次の写真を表示"
                        class="h-[13px] border-b border-transparent transition-jm group-hover:border-jm-linkHover"
                        width="24"
                        height="24"
                        role="img"
                        aria-hidden="false"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5 13L10.7292 8L5 3"
                          stroke="#FF6B56"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </svg>
                    </button>
                  </div>

                  <div className="flex flex-col items-start justify-start p-4 w-full h-full gap-4">
                    <p className="lg:text-xl md:text-sm text-[#343434]">
                      <span className="lg:text-2xl md:text-xl font-bold">
                        {allFacilities[selectedIndex].name}
                      </span>
                      <span className="text-base">の求人情報</span>
                    </p>
                    <div>
                      <p className="lg:text-sm md:text-xs text-[#343434]">
                        〒{allFacilities[selectedIndex].postal_code}
                      </p>
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
                    <div
                      className="lg:text-base text-sm text-[#343434] w-4/5"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {allFacilities[selectedIndex].introduction}
                    </div>
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
                      月
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
