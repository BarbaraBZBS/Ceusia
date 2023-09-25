import React from 'react'

export default function Loading() {
    return (
        //moon y ring
        // <div className='flex justify-center w-full h-full min-h-[800px] mt-40'>
        //     <div role='status' className="w-12 h-12 rounded-full animate-spin border-y-8 border-solid border-apppastgreen border-t-transparent shadow-md">
        //     </div>
        // </div>

        //closed x ring
        // <div className='flex justify-center w-full h-full min-h-[800px] mt-40'>
        //     <div role='status' className="w-12 h-12 rounded-full animate-spin border-x-4 border-solid border-apppink border-t-transparent shadow-md">
        //     </div>
        // </div>

        //dotted closed y ring
        <div className='flex justify-center w-full h-full min-h-[800px] mt-40'>
            <div role='status' className="w-12 h-12 rounded-full animate-spin border-x-4 border-dashed border-appturq border-t-transparent">
            </div>
        </div>
    )
}
