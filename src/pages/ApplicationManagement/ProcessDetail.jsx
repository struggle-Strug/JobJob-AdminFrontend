import { message, Modal } from "antd";
import { Button, Table } from "antd";
import moment from "moment";
import { useState } from "react";
import MemberDetailModal from "./MemberDetailModal";
import { getJobTypeValue } from "../../utils/getFunctions";
import { JobType } from "../../utils/constants/categories";
import axios from "axios";
import TextArea from "antd/es/input/TextArea";

const ProcessDetail = ({ processes, getProcessesByStatus }) => {
  const [message_id, setMessage_id] = useState("");
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [memberData, setMemberData] = useState(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [memos, setMemos] = useState({});

  const jobPostLink = (jobPost) => {
    const jobType = getJobTypeValue(JobType, jobPost.type);
    return `/${jobType}/details/${jobPost.jobpost_id}`;
  };

  const handleProfileModalOpen = (data) => {
    setMemberData(data);
    setProfileModalOpen(true);
  };

  const handleProfileModalClose = () => {
    setProfileModalOpen(false);
    setMemberData(null);
  };

  const handleJobpostPageOpen = (data) => {
    const url = jobPostLink(data); // Construct the URL for the new page
    window.open(url, "_blank"); // Open the URL in a new tab
  };

  const handleStatusModalOpen = (id) => {
    setMessage_id(id);
    setStatusModalOpen(true);
  };

  const handleStatusChange = async (value) => {
    const response = await axios.put(
      `${process.env.REACT_APP_API_URL}/api/v1/message/${message_id}`,
      { status: value }
    );
    if (response.data.error) return message.error(response.data.message);
    message.success("ステータスを変更しました。");
    getProcessesByStatus();
    setMessage_id("");
    setStatusModalOpen(false);
  };

  const handleMemoChange = (messageId, value) => {
    setMemos((prev) => ({
      ...prev,
      [messageId]: value,
    }));
  };

  const handleMemoSave = async (messageId) => {
    const memoValue = memos[messageId];
    const response = await axios.put(
      `${process.env.REACT_APP_API_URL}/api/v1/message/${messageId}`,
      { memo: memoValue }
    );
    if (response.data.error) return message.error(response.data.message);
    message.success("メモを保存しました。");
    getProcessesByStatus();
  };

  const columns = [
    {
      title: "会員番号・基本情報",
      dataIndex: "profile",
      key: "profile",
      render: (_, record) => (
        <div className="flex flex-col gap-2 items-start h-full">
          <div className="flex justify-start gap-4 w-full">
            <p className="text-sm font-bold">{record.user.name}</p>
            <p className="text-sm">{record.user.hiraganaName}</p>
          </div>
          <div className="flex justify-start gap-4">
            <p className="text-sm">{record.user.member_id}</p>
            <p className="text-sm">{record.user.gender}</p>
            <p className="text-sm">
              {new Date().getFullYear() -
                new Date(record.user.birthday).getFullYear()}
            </p>
          </div>
          <button
            className="text-[#FF2A3B] hover:underline duration-300"
            onClick={() => handleProfileModalOpen(record.user)}
          >
            プロフィールを確認
          </button>
        </div>
      ),
      width: 200,
    },
    {
      title: "対象求人",
      dataIndex: "jobpost",
      key: "jobpost",
      render: (_, record) => (
        <div className="flex flex-col gap-2 items-start">
          <p className="text-sm">{record.facility.name}</p>
          <p className="text-sm">{record.jobPost.type}</p>
          <p className="text-sm">{record.jobPost.employment_type[0]}</p>
          <button
            className="text-[#FF2A3B] hover:underline duration-300"
            onClick={() => handleJobpostPageOpen(record.jobPost)}
          >
            求人を確認
          </button>
        </div>
      ),
      width: 200,
    },
    {
      title: "応募日・更新日",
      dataIndex: "date",
      key: "date",
      render: (_, record) => (
        <div className="flex flex-col gap-1 items-start">
          <p className="text-sm">応募日：</p>
          <p className="text-sm">
            {moment(record.created_at).format("YYYY/MM/DD")}
          </p>
          <p className="text-sm">更新日：</p>
          <p className="text-sm">
            {moment(record.updated_at).format("YYYY/MM/DD")}
          </p>
        </div>
      ),
      width: 120,
    },
    {
      title: "ステータス",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <div className="flex flex-col items-start">
          <p className="text-sm">{record.status}</p>
          <Button
            className="px-4 py-1 mt-2 rounded-lg"
            onClick={() => handleStatusModalOpen(record.message_id)}
          >
            変更
          </Button>
        </div>
      ),
      width: 120,
    },
    {
      title: "メモ",
      dataIndex: "memo",
      key: "memo",
      render: (_, record) => (
        <div className="flex flex-col items-start">
          <TextArea
            className="w-full border-[1px] h-16"
            value={memos[record.message_id] ?? record.memo}
            onChange={(e) =>
              handleMemoChange(record.message_id, e.target.value)
            }
          />
          <Button
            className="px-4 py-1 mt-2 rounded-lg text-center w-full"
            onClick={() => handleMemoSave(record.message_id)}
          >
            保存
          </Button>
        </div>
      ),
      width: 100,
    },
  ];

  const data = processes.map((process) => ({
    user: process.user_id,
    facility: process.facility_id,
    jobPost: process.jobpost_id,
    created_at: process.created_at,
    updated_at: process.updated_at,
    status: process.status,
    message_id: process.message_id,
    memo: process.memo,
    key: process.message_id,
  }));

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 20,
          position: ["bottomCenter"], // Center the pagination at the bottom
        }}
        bordered
        size="small"
        rowClassName="align-top"
        className="[&_.ant-table-cell]:!whitespace-nowrap"
      />

      <MemberDetailModal
        open={profileModalOpen}
        onCancel={handleProfileModalClose}
        memberData={memberData}
      />

      <Modal
        open={statusModalOpen}
        onCancel={() => setStatusModalOpen(false)}
        title="ステータス変更"
        footer={null}
        width={300}
        className="modal"
      >
        <div
          className="text-center p-1 border-t-[1px] hover:bg-slate-300 cursor-pointer"
          onClick={() => handleStatusChange("応募済")}
        >
          応募済
        </div>
        <div
          className="text-center p-1 border-t-[1px] hover:bg-slate-300 cursor-pointer"
          onClick={() => handleStatusChange("書類選考中")}
        >
          書類選考中
        </div>
        <div
          className="text-center p-1 border-t-[1px] hover:bg-slate-300 cursor-pointer"
          onClick={() => handleStatusChange("面接日設定済")}
        >
          面接日設定済
        </div>
        <div
          className="text-center p-1 border-t-[1px] hover:bg-slate-300 cursor-pointer"
          onClick={() => handleStatusChange("面接実施中")}
        >
          面接実施中
        </div>
        <div
          className="text-center p-1 border-t-[1px] hover:bg-slate-300 cursor-pointer"
          onClick={() => handleStatusChange("内定済")}
        >
          内定済
        </div>
        <div
          className="text-center p-1 border-t-[1px] hover:bg-slate-300 cursor-pointer"
          onClick={() => handleStatusChange("内定承諾済")}
        >
          内定承諾済
        </div>
        <div
          className="text-center p-1 border-t-[1px] hover:bg-slate-300 cursor-pointer"
          onClick={() => handleStatusChange("入職済")}
        >
          入職済
        </div>
        <div
          className="text-center p-1 border-t-[1px] hover:bg-slate-300 cursor-pointer"
          onClick={() => handleStatusChange("不採用")}
        >
          不採用
        </div>
        <div
          className="text-center p-1 border-t-[1px] hover:bg-slate-300 cursor-pointer"
          onClick={() => handleStatusChange("内定辞退")}
        >
          内定辞退
        </div>
        <div
          className="text-center p-1 border-t-[1px] hover:bg-slate-300 cursor-pointer"
          onClick={() => handleStatusChange("選考終了")}
        >
          選考終了
        </div>
      </Modal>
    </>
  );
};

export default ProcessDetail;
