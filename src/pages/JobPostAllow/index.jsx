"use client";

import { Button, message, Modal, Space, Table } from "antd";
import axios from "axios";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Facilities } from "../../utils/constants/categories";

const JobPostAllow = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const jobMapping = {
    医師: "/dr",
    薬剤師: "/ph",
    "看護師/准看護師": "/nan",
    助産師: "/mw",
    保健師: "/phn",
    看護助手: "/nuas",
    診療放射線技師: "/mrt",
    臨床検査技師: "/clt",
    "管理栄養士/栄養士": "/rdn",
    "公認心理師/臨床心理士": "/cp",
    医療ソーシャルワーカー: "/msw",
    歯科医師: "/de",
    歯科衛生士: "/dh",
    歯科技工士: "/dt",
    歯科助手: "/deas",
    "介護職/ヘルパー": "/cwh",
    生活相談員: "/lc",
    ケアマネジャー: "/cm",
    "管理職（介護）": "/mp",
    サービス提供責任者: "/sp",
    生活支援員: "/lsw",
    福祉用具専門相談員: "/wesc",
    児童発達支援管理責任者: "/cdsm",
    保育士: "/chil",
    幼稚園教諭: "/kt",
    保育補助: "/ca",
    "児童指導員/指導員": "/cii",
    理学療法士: "/pt",
    言語聴覚士: "/st",
    作業療法士: "/ot",
    視能訓練士: "/ort",
    "調理師/調理スタッフ": "/ccs",
    美容師: "/hai",
    理容師: "/bar",
    ネイリスト: "/naar",
    アイリスト: "/el",
    "エステティシャン/セラピスト": "/et",
    美容部員: "/bcm",
    インストラクター: "/ins",
  };
  const columns = [
    {
      title: "申請日",
      dataIndex: "applicationDate",
      key: "applicationDate",
      width: 120,
    },
    {
      title: "職種",
      dataIndex: "jobType",
      key: "jobType",
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
            onClick={() => handleAllow(record.id, "allowed")}
          >
            掲載OK
          </Button>
          <Button
            className="bg-blue-100 text-blue-600 border-blue-200 hover:bg-blue-200"
            onClick={() => handleAllow(record.id, "draft")}
          >
            差し戻し
          </Button>
        </Space>
      ),
      width: 200,
    },
  ];

  const getJobPosts = useCallback(async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/v1/jobpost`
    );
    setJobPosts(
      response.data.jobposts.filter((jobPost) => jobPost.allowed === "pending")
    );
  }, []);

  const data = jobPosts?.map((jobPost) => ({
    id: jobPost.jobpost_id,
    applicationDate: moment(jobPost.created_at).format("YYYY/MM/DD"),
    jobType: jobPost.type,
    facilityId: jobPost.facility_id.facility_id,
    corporationId: jobPost.customer_id.customer_id,
  }));

  const handleAllow = async (id, status) => {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/v1/jobpost/${id}/${status}`
    );
    if (response.data.error) return message.error(response.data.message);
    if (status === "allowed") {
      message.success("求人掲載OK成功");
    } else {
      message.success("求人差し戻し成功");
    }
    getJobPosts();
  };

  const handlePreview = (index) => {
    setSelectedIndex(index); // Set the selected facility index
    setIsModalVisible(true); // Show the modal
  };

  useEffect(() => {
    document.title = "求人調査";
    getJobPosts();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen p-6">
      <p className="lg:text-2xl md:text-xl text-lg font-bold text-[#343434]">
        求人審査
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
        title="求人プレビュー"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            閉じる
          </Button>,
        ]}
        width={1200} // Adjust the width as needed
        className="modal"
      >
        {selectedIndex !== null && jobPosts[selectedIndex] ? (
          <div className="flex p-8">
            <div className="container">
              <div className="flex flex-col">
                <div className="flex flex-col bg-white p-4 rounded-lg">
                  {jobPosts[selectedIndex]?.picture.length === 0 ? (
                    <img
                      src={"/assets/images/noimage.png"}
                      alt={jobPosts[selectedIndex]?.sub_title}
                      className="w-2/3 object-cover rounded-lg"
                    />
                  ) : (
                    <img
                      src={
                        jobPosts[selectedIndex]?.picture[0] ||
                        "/placeholder.svg"
                      }
                      alt={jobPosts[selectedIndex]?.sub_title}
                      className="w-2/3 aspect-[2/1] object-cover rounded-lg"
                    />
                  )}
                </div>
                <div className="flex flex-col bg-white p-4 rounded-lg">
                  <p className="lg:text-lg font-bold text-sm text-[#343434]">
                    {jobPosts[selectedIndex]?.sub_title}
                  </p>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: jobPosts[selectedIndex]?.sub_description,
                    }}
                    className="p-2 lg:text-base text-sm mt-8 text-[#343434] overflow-auto"
                  />
                </div>
                <div className="flex flex-col bg-white px-4 rounded-lg mt-4">
                  <p className="lg:text-lg text-sm text-[#343434] font-bold py-6 border-b-[1px] border-[#e7e7e7]">
                    募集内容
                  </p>
                  <div className="flex items-start justify-start border-b-[1px] border-[#e7e7e7]">
                    <p className="lg:text-base text-sm font-bold text-[#343434] py-6 w-1/5">
                      募集職種
                    </p>
                    <p className="lg:text-base text-sm text-[#343434] py-6 w-4/5">
                      {jobPosts[selectedIndex]?.type}
                    </p>
                  </div>
                  <div className="flex items-start justify-start border-b-[1px] border-[#e7e7e7]">
                    <p className="lg:text-base text-sm font-bold text-[#343434] py-6 w-1/5">
                      仕事内容
                    </p>
                    <pre className="flex flex-col lg:text-base text-sm text-[#343434] py-6 w-4/5 overflow-auto whitespace-pre-wrap break-words">
                      <div className="inline-block items-start justify-start gap-2 w-4/5">
                        {jobPosts[selectedIndex]?.work_item.map(
                          (item, index) => {
                            return (
                              <div
                                key={index}
                                className="inline-block text-center bg-[#F5BD2E] text-white m-1 px-2 py-1 rounded-lg"
                              >
                                <p className="lg:text-[0.7rem] md:text-[0.6rem] font-bold">
                                  {item}
                                </p>
                              </div>
                            );
                          }
                        )}
                      </div>
                      {jobPosts[selectedIndex]?.work_content}
                    </pre>
                  </div>
                  <div className="flex items-start justify-start border-b-[1px] border-[#e7e7e7]">
                    <p className="lg:text-base text-sm font-bold text-[#343434] py-6 w-1/5">
                      診療科目・
                      <br />
                      サービス形態{" "}
                    </p>
                    <div className="inline-block items-start justify-start gap-2 w-4/5 py-6">
                      {jobPosts[selectedIndex]?.service_subject
                        .concat(jobPosts[selectedIndex]?.service_type)
                        .map((item, index) => {
                          return (
                            <div
                              key={index}
                              className="inline-block text-center bg-[#F5BD2E] text-white m-1 px-2 py-1 rounded-lg"
                            >
                              <p className="lg:text-[0.7rem] md:text-[0.6rem] font-bold">
                                {item}
                              </p>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  <div className="flex items-start justify-start border-b-[1px] border-[#e7e7e7]">
                    <p className="lg:text-base text-sm font-bold text-[#343434] py-6 w-1/5">
                      給与
                    </p>
                    <p className="lg:text-base text-sm text-[#343434] py-6 w-4/5">{`【${jobPosts[selectedIndex]?.employment_type}】 ${jobPosts[selectedIndex]?.salary_type} ${jobPosts[selectedIndex]?.salary_min}円〜${jobPosts[selectedIndex]?.salary_max}円`}</p>
                  </div>
                  <div className="flex items-start justify-start border-b-[1px] border-[#e7e7e7]">
                    <p className="lg:text-base text-sm font-bold text-[#343434] py-6 w-1/5">
                      給与の備考
                    </p>
                    <div className="lg:text-base text-sm text-[#343434] py-6 w-4/5 overflow-auto">
                      <pre className="whitespace-pre-wrap break-words">
                        {jobPosts[selectedIndex]?.salary_remarks}
                      </pre>
                    </div>
                  </div>
                  <div className="flex items-start justify-start border-b-[1px] border-[#e7e7e7]">
                    <p className="lg:text-base text-sm font-bold text-[#343434] py-6 w-1/5">
                      待遇
                    </p>
                    <div className="flex flex-col w-4/5 py-6">
                      <div className="inline-block items-start justify-start gap-2">
                        {jobPosts[selectedIndex]?.treatment_type.map(
                          (item, index) => {
                            return (
                              <div
                                key={index}
                                className="inline-block text-center bg-[#F5BD2E] text-white m-1 px-2 py-1 rounded-lg"
                              >
                                <p className="lg:text-[0.7rem] md:text-[0.6rem] font-bold">
                                  {item}
                                </p>
                              </div>
                            );
                          }
                        )}
                      </div>
                      <div className="lg:text-base text-sm text-[#343434] mt-4 overflow-auto">
                        <pre className="whitespace-pre-wrap break-words">
                          {jobPosts[selectedIndex]?.treatment_content}
                        </pre>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start justify-start border-b-[1px] border-[#e7e7e7]">
                    <p className="lg:text-base text-sm font-bold text-[#343434] py-6 w-1/5">
                      長期休暇・特別休暇
                    </p>
                    <div className="lg:text-base text-sm text-[#343434] py-6 w-4/5 overflow-auto">
                      <pre className="whitespace-pre-wrap break-words">
                        {jobPosts[selectedIndex]?.special_content}
                      </pre>
                    </div>
                  </div>
                  <div className="flex items-start justify-start border-b-[1px] border-[#e7e7e7]">
                    <p className="lg:text-base text-sm font-bold text-[#343434] py-6 w-1/5">
                      教育体制・研修
                    </p>
                    <div className="inline-block items-start justify-start gap-2 w-4/5 py-6">
                      {jobPosts[selectedIndex]?.education_content.map(
                        (item, index) => {
                          return (
                            <div
                              key={index}
                              className="inline-block text-center bg-[#F5BD2E] text-white m-1 px-2 py-1 rounded-lg"
                            >
                              <p className="lg:text-[0.7rem] md:text-[0.6rem] font-bold">
                                {item}
                              </p>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                  <div className="flex items-start justify-start border-b-[1px] border-[#e7e7e7]">
                    <p className="lg:text-base text-sm font-bold text-[#343434] py-6 w-1/5">
                      勤務時間
                    </p>
                    <div className="flex flex-col w-4/5 py-6">
                      <div className="inline-block items-start justify-start gap-2">
                        {jobPosts[selectedIndex]?.work_time_type.map(
                          (item, index) => {
                            return (
                              <div
                                key={index}
                                className="inline-block text-center bg-[#F5BD2E] text-white m-1 px-2 py-1 rounded-lg"
                              >
                                <p className="lg:text-[0.7rem] md:text-[0.6rem] font-bold">
                                  {item}
                                </p>
                              </div>
                            );
                          }
                        )}
                      </div>
                      <div className="lg:text-base text-sm text-[#343434] mt-4 overflow-auto">
                        <pre className="whitespace-pre-wrap break-words">
                          {jobPosts[selectedIndex]?.work_time_content}
                        </pre>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start justify-start border-b-[1px] border-[#e7e7e7]">
                    <p className="lg:text-base text-sm font-bold text-[#343434] py-6 w-1/5">
                      休日
                    </p>
                    <div className="flex flex-col w-4/5 py-6">
                      <div className="inline-block items-start justify-start gap-2">
                        {jobPosts[selectedIndex]?.rest_type.map(
                          (item, index) => {
                            return (
                              <div
                                key={index}
                                className="inline-block text-center bg-[#F5BD2E] text-white m-1 px-2 py-1 rounded-lg"
                              >
                                <p className="lg:text-[0.7rem] md:text-[0.6rem] font-bold">
                                  {item}
                                </p>
                              </div>
                            );
                          }
                        )}
                      </div>
                      <div className="lg:text-base text-sm text-[#343434] mt-4 overflow-auto">
                        <pre className="whitespace-pre-wrap break-words">
                          {jobPosts[selectedIndex]?.rest_content}
                        </pre>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start justify-start border-b-[1px] border-[#e7e7e7]">
                    <p className="lg:text-base text-sm font-bold text-[#343434] py-6 w-1/5">
                      応募要件
                    </p>
                    <div className="flex flex-col w-4/5 py-6">
                      <div className="inline-block items-start justify-start gap-2">
                        {jobPosts[selectedIndex]?.qualification_type
                          .concat(jobPosts[selectedIndex]?.qualification_other)
                          .map((item, index) => {
                            return (
                              <div
                                key={index}
                                className="inline-block text-center bg-[#F5BD2E] text-white m-1 px-2 py-1 rounded-lg"
                              >
                                <p className="lg:text-[0.7rem] md:text-[0.6rem] font-bold">
                                  {item}
                                </p>
                              </div>
                            );
                          })}
                      </div>
                      <div className="lg:text-base text-sm text-[#343434] mt-4 overflow-auto">
                        <pre className="whitespace-pre-wrap break-words">
                          {jobPosts[selectedIndex]?.qualification_content}
                        </pre>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start justify-start border-b-[1px] border-[#e7e7e7]">
                    <p className="lg:text-base text-sm font-bold text-[#343434] py-6 w-1/5">
                      歓迎要件
                    </p>
                    <div className="flex flex-col w-4/5 py-6">
                      <div className="lg:text-base text-sm text-[#343434] overflow-auto">
                        <pre className="whitespace-pre-wrap break-words">
                          {jobPosts[selectedIndex]?.qualification_welcome}
                        </pre>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start justify-start">
                    <p className="lg:text-base text-sm font-bold text-[#343434] py-6 w-1/5">
                      選考プロセス
                    </p>
                    <div className="lg:text-base text-sm text-[#343434] py-6 w-4/5 overflow-auto">
                      <pre className="whitespace-pre-wrap break-words">
                        {jobPosts[selectedIndex]?.process}
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col bg-white p-4 rounded-lg mt-8">
                  <p className="lg:text-lg font-bold text-sm text-[#343434]">
                    写真
                  </p>
                  <div className="grid grid-cols-3 justify-start gap-2 py-4">
                    {jobPosts[selectedIndex]?.picture?.length > 0 &&
                      jobPosts[selectedIndex]?.picture?.map((item, index) => {
                        return (
                          <img
                            key={index}
                            src={item || "/placeholder.svg"}
                            alt="jobpost"
                            className="col-span-1 w-full aspect-[2/1] object-cover rounded-lg"
                          />
                        );
                      })}
                  </div>
                </div>
                <div className="flex flex-col bg-white px-4 rounded-lg mt-8">
                  <p className="lg:text-lg font-bold text-sm text-[#343434] border-b-[1px] py-6 border-[#e7e7e7]">
                    事業所情報
                  </p>
                  <div className="flex items-start justify-start border-b-[1px] py-6 border-[#e7e7e7]">
                    <p className="lg:text-base text-sm font-bold text-[#343434] w-1/5">
                      法人・施設名
                    </p>
                    <Link
                      to={`/facility/${jobPosts[selectedIndex]?.facility_id.facility_id}`}
                      className="lg:text-base text-sm text-[#FF2A3B] hover:underline w-4/5"
                    >
                      {jobPosts[selectedIndex]?.facility_id.name}
                    </Link>
                  </div>
                  <div className="flex items-start justify-start border-b-[1px] py-6 border-[#e7e7e7]">
                    <p className="lg:text-base text-sm font-bold text-[#343434] w-1/5">
                      募集職種
                    </p>
                    <div className="flex flex-col items-start, justify-start w-4/5">
                      <Link
                        to={`${jobMapping[jobPosts[selectedIndex]?.type]}`}
                        className="lg:text-base text-sm text-[#FF2A3B] hover:underline"
                      >
                        {jobPosts[selectedIndex]?.type}(
                        {jobPosts[selectedIndex]?.employment_type})
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-start justify-start border-b-[1px] py-6 border-[#e7e7e7]">
                    <p className="lg:text-base text-sm font-bold text-[#343434] w-1/5">
                      施設紹介
                    </p>
                    <div className="lg:text-base text-sm text-[#343434] w-4/5 overflow-auto">
                      <pre className="whitespace-pre-wrap break-words">
                        {jobPosts[selectedIndex]?.facility_id.introduction}
                      </pre>
                    </div>
                  </div>
                  <div className="flex items-start justify-start border-b-[1px] py-6 border-[#e7e7e7]">
                    <p className="lg:text-base text-sm font-bold text-[#343434] w-1/5">
                      アクセス
                    </p>
                    <div className="flex flex-col items-start justify-start w-4/5">
                      <div className="inline-block items-start justify-start gap-2">
                        {jobPosts[selectedIndex]?.facility_id.access.map(
                          (item, index) => {
                            return (
                              <div
                                key={index}
                                className="inline-block text-center bg-[#F5BD2E] text-white m-1 px-2 py-1 rounded-lg"
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
                        {jobPosts[selectedIndex]?.facility_id.prefecture}
                        {jobPosts[selectedIndex]?.facility_id.city}
                        {jobPosts[selectedIndex]?.facility_id.village}
                        {jobPosts[selectedIndex]?.facility_id.building}
                      </p>
                      <div className="w-full py-4 aspect-square">
                        <iframe
                          title="Google Map"
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          loading="lazy"
                          allowFullScreen
                          src={`https://www.google.com/maps?q=${jobPosts[selectedIndex]?.facility_id.prefecture}${jobPosts[selectedIndex]?.facility_id.city}${jobPosts[selectedIndex]?.facility_id.village}${jobPosts[selectedIndex]?.facility_id.building}&output=embed`}
                        ></iframe>
                      </div>
                      <p className="lg:text-base text-sm text-[#343434] mt-1">
                        {jobPosts[selectedIndex]?.facility_id.access_text}
                      </p>
                      <Link
                        to={`https://www.google.com/maps?q=${encodeURIComponent(
                          `${jobPosts[selectedIndex]?.facility_id.prefecture}${jobPosts[selectedIndex]?.facility_id.city}${jobPosts[selectedIndex]?.facility_id.village}${jobPosts[selectedIndex]?.facility_id.building}`
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
                        jobPosts[
                          selectedIndex
                        ]?.facility_id.establishment_date.split("-")[0]
                      }
                      年
                      {
                        jobPosts[
                          selectedIndex
                        ]?.facility_id.establishment_date.split("-")[1]
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
                            jobPosts[selectedIndex]?.facility_id.facility_genre
                          ]
                        }`}
                        className="lg:text-base text-sm text-[#FF2A3B] hover:underline"
                      >
                        {jobPosts[selectedIndex]?.facility_id.facility_genre}
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-start justify-start border-b-[1px] py-6 border-[#e7e7e7]">
                    <p className="lg:text-base text-sm font-bold text-[#343434] w-1/5">
                      営業時間
                    </p>
                    <div className="lg:text-base text-sm text-[#343434] w-4/5 overflow-auto">
                      <pre className="whitespace-pre-wrap break-words">
                        {jobPosts[selectedIndex]?.facility_id.service_time}
                      </pre>
                    </div>
                  </div>
                  <div className="flex items-start justify-start py-6">
                    <p className="lg:text-base text-sm font-bold text-[#343434] w-1/5">
                      休日
                    </p>
                    <div className="lg:text-base text-sm text-[#343434] w-4/5 overflow-auto">
                      <pre className="whitespace-pre-wrap break-words">
                        {jobPosts[selectedIndex]?.facility_id.rest_day}
                      </pre>
                    </div>
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

export default JobPostAllow;
