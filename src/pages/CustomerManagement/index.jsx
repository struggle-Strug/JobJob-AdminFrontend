import { Button, Input, Space, Table } from "antd";
import axios from "axios";
import { Download } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";

const CustomerManagement = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [allCustomers, setAllCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [jobposts, setJobposts] = useState([]);

    // Table columns
    const columns = [
        {
            title: '登録日',
            dataIndex: 'registrationDate',
            key: 'registrationDate',
            width: 120,
        },
        {
            title: '法人名',
            dataIndex: 'corporationName',
            key: 'corporationName',
            width: 120,
        },
        {
            title: '法人ID',
            dataIndex: 'corporationId',
            key: 'corporationId',
            width: 120,
        },
        {
            title: '担当者名',
            dataIndex: 'contactName',
            key: 'contactName',
            width: 120,
        },
        {
            title: 'メールアドレス',
            dataIndex: 'email',
            key: 'email',
            width: 120,
        },
        {
            title: '電話番号',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            width: 120,
        },
        {
            title: '公開施設数',
            dataIndex: 'facilityCount',
            key: 'facilityCount',
            width: 120,
        },
        {
            title: '公開求人数',
            dataIndex: 'jobpostCount',
            key: 'jobpostCount',
            width: 120,
        },
        {
            title: '管理画面',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    <Button 
                        type="primary"
                        className="bg-blue-100 text-blue-600 border-blue-200 hover:bg-blue-200"
                    >
                        管理画面
                    </Button>
                </Space>
            ),
            width: 120,
        },
    ];

    const data = filteredCustomers.map((customer, index) => ({
        key: index,
        registrationDate: moment(customer.registrationDate).format('YYYY/MM/DD'),
        corporationName: customer.companyName,
        corporationId: customer.customer_id,
        contactName: customer.contactPerson,
        email: customer.email,
        phoneNumber: customer.phoneNumber,
        facilityCount: facilities.filter(facility => facility.customer_id === customer._id).length,
        jobpostCount: jobposts.filter(jobpost => jobpost.customer_id === customer._id).length,
    }));

    const getAllCustomers = async () => {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/customers/all`);
        const customers = response.data.customers;
        setAllCustomers(customers);
        setFilteredCustomers(customers.filter(customer => customer.allowed === true).sort((a, b) => new Date(a.registrationDate) - new Date(b.registrationDate)));
        setFacilities(response.data.facilities);
        setJobposts(response.data.jobposts);
    }

    const handleSearch = () => {
        const filteredData = allCustomers.filter(customer => 
            customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
            customer.customer_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCustomers(filteredData);
    }

    useEffect(() => {
        getAllCustomers();
    }, []);

    return (
        <div className="min-h-screen p-6">
            <p className="lg:text-2xl md:text-xl text-lg font-bold text-[#343434]">施設管理</p>
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
                </div>
            </div>
        </div>
    )
}

export default CustomerManagement;