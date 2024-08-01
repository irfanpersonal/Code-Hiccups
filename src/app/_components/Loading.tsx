import {FaRegTired} from "react-icons/fa";

interface LoadingProps {
    title: string;
    position: 'normal' | 'center';
    marginTop?: string;
}

const Loading: React.FunctionComponent<LoadingProps> = ({ title, position, marginTop }) => {
    return (
        <div className={`flex flex-col items-center h-screen ${position === 'center' ? 'justify-center' : 'justify-start'}`} style={{marginTop: marginTop}}>
            <div className="loading flex justify-center items-center rounded-full w-15 h-15 animate-spin bg-white shadow-lg">
                <FaRegTired className="text-black text-2xl"/>
            </div>
            <h1 className="mt-4 text-xl text-gray-800">{title}</h1>
        </div>
    );
};

// Something really important to note here is that for some reason the styled-component code will have a delay in the 
// front end. BUT if I use TailwindCSS exclusively it won't have that small delay where the styling is not applied. 

// const Wrapper = styled.div`
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     height: 100vh;
//     .loading {
//         display: flex;
//         justify-content: center;
//         align-items: center;
//         border: 0.5rem solid black;
//         border-radius: 50%;
//         width: 3.75rem;
//         height: 3.75rem;
//         animation: spinner 1.5s infinite alternate;
//         background-color: white;
//         box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1);
//     }
//     .icon {
//         color: black;
//         font-size: 2rem;
//     }
//     h1 {
//         margin-top: 1rem;
//         font-size: 1.5rem;
//         color: #333; 
//     }
//     @keyframes spinner {
//         0% {
//             transform: rotate(0deg);
//         }
//         100% {
//             transform: rotate(360deg);
//         }
//     }
// `;

export default Loading;