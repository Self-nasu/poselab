import { Button } from "@/components/ui"

const Landing = () => {
    return (
        <div className="flex justify-between w-full min-h-[90vh] items-center">
            <div className="w-full">
                <div>
                    <h1 className="text-6xl text-primary-text font-semibold">Tech <span className="text-primary text-6xl font-semibold ">That Work&#39;s</span></h1>
                    <h1 className="text-6xl text-primary-text font-semibold mt-6"> The Way You do.</h1>
                </div>
                <div>
                    <p className="text-primary-text/60 max-w-md text-base font-normal mt-14">We build intuitive tech that fits your workflow, not the other way around. Web, AI, ERP, IoT, and more. Nexio — one team, endless solutions.</p>
                </div>
                <Button
                variant="solid"
                size='sm'
                className="mt-14 animate__animated animate__tada animate__fast animate__delay-4s"
                >
                    Got 10 Minutes? Let&#39;s Talk
                </Button>
            </div>

            <div style={{ 
                backgroundImage: `url('/home/tech_stack.png')`,
            }} className="hidden md:flex w-[90%] h-[84vh] bg-center animate__animated animate__fadeIn bg-contain bg-no-repeat space-y-32 flex-col justify-center items-center">
                <div className="bg-white animate__animated animate__fadeInDown animate__faster animate__delay-1s rounded-md py-3 transform translate-x-[-6.5rem] rotate-[-4deg] border border-gray-300 px-6 max-w-[80%] flex items-center shadow-lg">
                    <div className="mr-6"> 
                        <h1 className="text-6xl text-secondary font-semibold">1</h1>
                    </div>
                    <div>
                        <h1 className="text-xl text-primary-text font-semibold">Quick Chat — Just 10 Minutes</h1>
                        <p className="text-primary-text/60 max-w-md text-sm font-light">We listen to your needs, ideas, or tech problems. No sales talk, just understanding what you need.</p>
                    </div>
                </div>
                <div className="bg-white animate__animated animate__fadeInRight animate__faster animate__delay-2s rounded-md py-3 transform translate-x-[4rem] rotate-[3deg] border border-gray-300 px-6 max-w-[80%] flex items-center shadow-lg">
                    <div className="mr-6">
                        <h1 className="text-6xl text-secondary font-semibold">2</h1>
                    </div>
                    <div>
                        <h1 className="text-xl text-primary-text font-semibold">Smart Plan — Tailored For You</h1>
                        <p className="text-primary-text/60 max-w-md text-sm font-light">We share a possible solution — whether it’s a website, ERP, AI, or anything else — custom-fit to your goals.</p>
                    </div>
                </div>
                <div className="bg-white animate__animated animate__fadeInRight animate__faster animate__delay-3s rounded-md py-3 transform translate-x-[-8.5rem] translate-y-[-2.5rem] rotate-[7deg] border border-gray-300 px-6 max-w-[80%] flex items-center shadow-lg">
                    <div className="mr-6">
                        <h1 className="text-6xl text-secondary font-semibold">3</h1>
                    </div>
                    <div>
                        <h1 className="text-xl text-primary-text font-semibold">You Decide — No Pressure</h1>
                        <p className="text-primary-text/60 max-w-md text-sm font-light">We leave it with you. Start when you’re ready. No obligations, no pushy follow-ups.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Landing