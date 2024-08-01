import {type QuestionType, setGetAllQuestionsData} from '../_features/questions/questionsSlice';
import {interests} from '../_utils/interests';
import useStore from '../_utils/redux';
import QuestionsListItem from './QuestionsListItem';
import Image from 'next/image';
import desert from '../_images/desert.jpg';

interface QuestionsListProps {
    data: QuestionType[],
    totalQuestions: number
}
 
const QuestionsList: React.FunctionComponent<QuestionsListProps> = ({data, totalQuestions}) => {
    const dispatch = useStore().dispatch;
    const {getAllQuestionsData} = useStore().selector.questions;
    return (
        <section>
            <div className="border-b-8 border-black flex justify-between items-center pb-4">
                <div className="font-bold">{totalQuestions === 0 ? 'No Questions Found...' : `${totalQuestions} questions found ...`}</div>
                <div>
                    <select value={getAllQuestionsData.tagValue} onChange={(event) => {
                        dispatch(setGetAllQuestionsData({tagValue: event.target.value}));
                    }} id="tagValue" name="tagValue" className="text-center border p-1">
                        <option value=""></option>
                        {interests.map(item => {
                            return (
                                <option key={item}>{item}</option>
                            );
                        })}
                    </select>
                    <select value={getAllQuestionsData.questionStatus} onChange={(event) => {
                        dispatch(setGetAllQuestionsData({questionStatus: event.target.value}));
                    }} id="questionStatus" name="questionStatus" className="text-center border p-1 ml-4">
                        <option value=""></option>
                        <option value="answered">Answered</option>
                        <option value="unanswered">Unanswered</option>
                    </select>
                </div>
            </div>
            {totalQuestions === 0 && (
                <div className="flex flex-col items-center">
                    <Image className="object-contain w-1/2 h-auto mx-auto mt-4" src={desert} width={150} height={150} alt="Empty Nature" priority/>
                    <div className="font-bold text-2xl mt-4">-_-</div>
                </div>
            )}
            {data.map(item => {
                return (
                    <QuestionsListItem key={item.id} data={item}/>
                );
            })}
        </section>
    );
}

export default QuestionsList;