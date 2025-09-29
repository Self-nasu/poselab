import Landing from "./compo/Landing";
import WhatWeDo from "./compo/WhatWeDo";


const Home = () => {
    return (
        <div className="w-full px-16 flex flex-col justify-center items-center">
            <Landing />
            <WhatWeDo />
        </div>
    );
};

export default Home;