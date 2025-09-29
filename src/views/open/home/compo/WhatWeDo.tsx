
const WhatWeDo = () => {
    return (
        <div>
            <div className="flex flex-col justify-center items-center">
                <h1 className="text-4xl text-primary-text font-semibold">What We Do</h1>
                <p className="text-primary-text/60 max-w-xl text-center text-lg font-normal mt-6">We craft powerful digital products and connected experiences that help you move faster, scale smarter, and serve better</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mt-16">
                <div className="bg-white p-4 border border-gray-300 rounded-md flex flex-col">
                    <h2 className="text-xl text-primary-text font-semibold">Web Development</h2>
                    <p className="text-primary-text/60 max-w-lg text-sm font-light mt-2">Building modern, responsive web applications with cutting-edge technologies. Designed to scale with your business and deliver real results.</p>
                    <img src="/home/web-stack.png" alt="web stack" className="mt-4 w-[72%]" />
                </div>

                <div className="bg-white p-4 border border-gray-300 rounded-md flex flex-col">
                    <h2 className="text-xl text-primary-text font-semibold">AI/ML Solutions</h2>
                    <p className="text-primary-text/60 max-w-lg text-sm font-light mt-2">Developing intelligent systems and machine learning models for real-world applications. Turning complex data into actionable outcomes.</p>
                    <img src="/home/ai-stack.png" alt="web stack" className="mt-4 w-[72%]" />
                </div>

                <div className="bg-white p-4 border border-gray-300 rounded-md flex flex-col">
                    <h2 className="text-xl text-primary-text font-semibold">Mobile Apps</h2>
                    <p className="text-primary-text/60 max-w-lg text-sm font-light mt-2">Creating cross-platform mobile applications that deliver exceptional user experiences. Built with performance, consistency, and native feel across all devices.</p>
                    <img src="/home/mobile-stack.png" alt="web stack" className="mt-4 w-[40%]" />
                </div>

                <div className="bg-white p-4 border border-gray-300 rounded-md flex flex-col">
                    <h2 className="text-xl text-primary-text font-semibold">Backend Systems</h2>
                    <p className="text-primary-text/60 max-w-lg text-sm font-light mt-2">Designing robust server-side architectures and database management systems. From APIs to data flow — everything optimized and reliable.</p>
                    <img src="/home/backend-stack.png" alt="web stack" className="mt-4 w-[78%]" />
                </div>

                <div className="bg-white p-4 border border-gray-300 rounded-md flex flex-col">
                    <h2 className="text-xl text-primary-text font-semibold">MicroService</h2>
                    <p className="text-primary-text/60 max-w-lg text-sm font-light mt-2">Architecting scalable, decoupled microservices for modern cloud-native applications. Each service is built for resilience, flexibility, and independent deployment.</p>
                    <img src="/home/service-stack.png" alt="web stack" className="mt-4 w-[78%]" />
                </div>

                <div className="bg-white p-4 border border-gray-300 rounded-md flex flex-col">
                    <h2 className="text-xl text-primary-text font-semibold">IoT & Hardware</h2>
                    <p className="text-primary-text/60 max-w-lg text-sm font-light mt-2">Working with ESP32/Arduino and embedded systems for innovative IoT solutions. From smart homes to  any automation — we make devices smarter.</p>
                    <img src="/home/iot-stack.png" alt="web stack" className="mt-3.5 w-[62%]" />
                </div>
            </div>
        </div>
    )
}

export default WhatWeDo