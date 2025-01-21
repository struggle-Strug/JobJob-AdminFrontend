import axios from "axios";
import { Button, Table } from "antd";
import { useEffect, useState } from "react";
import { JobType } from "../../utils/constants/categories";

const JobPostManagement = () => {
    const [allJobPosts, setAllJobPosts] = useState([]);
    const [filteredJobPosts, setFilteredJobPosts] = useState([]);
    const [selectedJobPostType, setSelectedJobPostType] = useState("1");

    const allJobTypes = [
        ...Object.keys(JobType.医科),
        ...Object.keys(JobType.歯科),
        ...Object.keys(JobType.介護),
        ...Object.keys(JobType.保育),
        ...Object.keys(JobType["リハビリ／代替医療"]),
        ...Object.keys(JobType.その他),
        ...Object.keys(JobType["ヘルスケア／美容"]),
    ]

    const columns = [
        {
        title: "",
        dataIndex: "role",
        key: "role",
        width: 200,
        },
        {
        title: "すべて",
        dataIndex: "all",
        key: "all",
        align: "center",
        },
        {
        title: "掲載申請中",
        dataIndex: "pending",
        key: "pending",
        align: "center",
        },
        {
        title: "掲載中",
        dataIndex: "published",
        key: "published",
        align: "center",
        },
        {
        title: "掲載終了",
        dataIndex: "completed",
        key: "completed",
        align: "center",
        },
    ];

    const data = [
        {
        key: "1",
        role: "すべて",
        all: filteredJobPosts.length.toString(),
        pending: filteredJobPosts.filter(jobPost => jobPost.allowed === "pending").length.toString(),
        published: filteredJobPosts.filter(jobPost => jobPost.allowed === "allowed").length.toString(),
        completed: filteredJobPosts.filter(jobPost => jobPost.allowed === "ended").length.toString(),
        },
        ...allJobTypes.map((jobType, index) => ({
            key: index,
            role: jobType,
            all: filteredJobPosts.filter(jobPost => jobPost.type === jobType).length.toString(),
            pending: filteredJobPosts.filter(jobPost => jobPost.allowed === "pending" && jobPost.type === jobType).length.toString(),
            published: filteredJobPosts.filter(jobPost => jobPost.allowed === "allowed" && jobPost.type === jobType).length.toString(),
            completed: filteredJobPosts.filter(jobPost => jobPost.allowed === "ended" && jobPost.type === jobType).length.toString(),
        })),
    ];



    const getJobPosts = async () => {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/jobpost`);
        setAllJobPosts(response.data.jobposts);
        setFilteredJobPosts(response.data.jobposts);
    }

    useEffect(() => {
        getJobPosts();
    }, []);

    useEffect(() => {
        selectedJobPostType === "1" && setFilteredJobPosts(allJobPosts);
        selectedJobPostType === "2" && setFilteredJobPosts(allJobPosts.filter(jobPost => jobPost.employment_type[0] === "正職員"));
        selectedJobPostType === "3" && setFilteredJobPosts(allJobPosts.filter(jobPost => jobPost.employment_type[0] === "契約社員"));
        selectedJobPostType === "4" && setFilteredJobPosts(allJobPosts.filter(jobPost => jobPost.employment_type[0] === "パート・アルバイト"));
        selectedJobPostType ==="5" && setFilteredJobPosts(allJobPosts.filter(jobPost => jobPost.employment_type[0] === "業務委託"));
    }, [selectedJobPostType]);

    return (
        <div className="min-h-screen p-6">
            <p className="lg:text-2xl md:text-xl text-lg font-bold text-[#343434]">求人管理</p>
            <div className="p-4 mt-8 flex flex-col justify-start">
                <div className="flex justify-start">
                    <Button type={selectedJobPostType === "1" ? "primary" : "default"} onClick={() => setSelectedJobPostType("1")}>すべて</Button>
                    <Button type={selectedJobPostType === "2" ? "primary" : "default"} onClick={() => setSelectedJobPostType("2")}>正社員</Button>
                    <Button type={selectedJobPostType === "3" ? "primary" : "default"} onClick={() => setSelectedJobPostType("3")}>契約社員</Button>
                    <Button type={selectedJobPostType === "4" ? "primary" : "default"} onClick={() => setSelectedJobPostType("4")}>パート・アルバイト</Button>
                    <Button type={selectedJobPostType === "5" ? "primary" : "default"} onClick={() => setSelectedJobPostType("5")}>業務委託</Button>
                </div>
                <div className="mt-4">
                    <Table
                        columns={columns}
                        dataSource={data}
                        pagination={{ pageSize: 10 }}
                        bordered
                        size="middle"
                        className="w-full"
                    />
                </div>
            </div>
        </div>
    );
}

export default JobPostManagement;