import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {Navbar} from './_components';
import GlobalLoading from "./GlobalLoading";
import Providers from './Providers';

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
	title: "Code Hiccups",
	description: "Generated by create next app"
};

interface RootLayoutProps {
	children: React.ReactNode
}

const RootLayout: React.FunctionComponent<RootLayoutProps> = ({children}) => {
	return (
		<html lang="en">
      		<body className={inter.className}>
                <Providers>
                    <GlobalLoading>
                        <div className="flex">
                            <div className="2xl:w-1/6 xl:w-1/5 lg:w-1/4 md:w-1/4 sm:w-1/3 w-1/3 bg-gray">
                                <Navbar/>
                            </div>
                            <div className="flex-1 p-4 h-screen overflow-scroll">
                                    {children}
                            </div>
                        </div>
                    </GlobalLoading>
                </Providers>
			</body>
    	</html>
	);
}

export default RootLayout;