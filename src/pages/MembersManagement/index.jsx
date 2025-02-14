import { Button, Input, message, Space, Table } from "antd";
import axios from "axios";
import { Download } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import MemberDetailModal from "../ApplicationManagement/MemberDetailModal";
import moment from "moment";

const MembersManagement = () => {
  const [members, setMembers] = useState([]);
  const [memberProfileModal, setMemberProfileModal] = useState(false);
  const [memberData, setMemberData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Table columns
  const columns = [
    {
      title: "登録日",
      dataIndex: "registrationDate",
      key: "registrationDate",
      width: 120,
    },
    {
      title: "会員名",
      dataIndex: "memberName",
      key: "memberName",
      width: 120,
    },
    {
      title: "会員ID",
      dataIndex: "memberId",
      key: "memberId",
      width: 120,
    },
    {
      title: "メールアドレス",
      dataIndex: "email",
      key: "email",
      width: 120,
    },
    {
      title: "電話番号",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 120,
    },
    {
      title: "詳細",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            className="bg-blue-100 text-blue-600 border-blue-200 hover:bg-blue-200"
            onClick={() => handleProfileModalOpen(record.member)}
          >
            詳細
          </Button>
          <Button
            type="primary"
            className={`${
              record.member.deleted
                ? "bg-blue-100 text-blue-600"
                : "bg-[#FF2A3B] text-[#343434]"
            }  border-blue-200 hover:bg-blue-200`} // Added space before `text-[#343434]`
            onClick={() => handleStopMember(record.member.member_id)}
          >
            {record.member.deleted ? "休止を解除" : "休止する"}
          </Button>
        </Space>
      ),
      width: 120,
    },
  ];

  const data = members.map((member, index) => ({
    key: index,
    member: member,
    registrationDate: moment(member.created_at).format("YYYY-MM-DD"),
    memberName: member.name,
    email: member.email,
    phoneNumber: member.phoneNumber,
  }));

  const handleProfileModalOpen = (data) => {
    setMemberData(data);
    setMemberProfileModal(true);
  };

  const handleProfileModalClose = () => {
    setMemberProfileModal(false);
    setMemberData(null);
  };

  const handleStopMember = useCallback(async (id) => {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/v1/user/stop/${id}`
    );
    if (response.data.error) return message.error(response.data.error);
    getAllMembers();
  }, []);

  const getAllMembers = useCallback(async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/v1/user/all`
    );
    const members = response.data.members;
    setMembers(members);
  }, []);
  const handleSearch = () => {
    console.log("asdfasd");
  };
  useEffect(() => {
    document.title = "CS会員管理";
    getAllMembers();
  }, []);
  return (
    <div className="min-h-screen p-6">
      <p className="lg:text-2xl md:text-xl text-lg font-bold text-[#343434]">
        CS会員管理
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

          <MemberDetailModal
            open={memberProfileModal}
            onCancel={handleProfileModalClose}
            memberData={memberData}
          />
        </div>
      </div>
    </div>
  );
};

export default MembersManagement;
