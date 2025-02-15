import { Spin } from "antd";

const Loading = () => {
    return (
        <div className='flex justify-center items-center h-screen w-full'>
            <Spin size='large' />
        </div>
    )
}

export default Loading;