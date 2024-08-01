import useStore from "../_utils/redux";

interface PaginationBoxProps {
    numberOfPages: number,
    pageValue: number,
    setData: Function
}

const PaginationBox: React.FunctionComponent<PaginationBoxProps> = ({numberOfPages, pageValue, setData}) => {
    const dispatch = useStore().dispatch;
    const handlePageNavigation = (event: React.MouseEvent<HTMLDivElement>) => {
        const id = event.currentTarget.id;
        if (id === 'left') {
            const newValue = pageValue - 1;
            if (newValue === 0) {
                return;
            }
            dispatch(setData({pageValue: newValue}));
        }
        else {
            const newValue = pageValue + 1;
            if (newValue > numberOfPages) {
                return;
            }
            dispatch(setData({pageValue: newValue}));
        }
    }
    return (
        <div className="flex justify-center items-center">
            <div onClick={handlePageNavigation} className="py-2 px-4 bg-gray-500 cursor-pointer" id="left">&#60;</div>
            <div className="flex ml-4">
                {Array.from({length: numberOfPages}, (_, index) => {
                    return (
                        <div onClick={() => {
                            dispatch(setData({pageValue: index + 1}));
                        }} className={`bg-black py-2 px-4 text-white select-none cursor-pointer mr-4 ${pageValue === index + 1 && 'border-2 border-x-green-600'}`} key={index + 1}>{index + 1}</div>
                    );
                })}
            </div>
            <div onClick={handlePageNavigation} className="py-2 px-4 bg-gray-500 cursor-pointer" id="right">&#62;</div>
        </div>
    );
}

export default PaginationBox;