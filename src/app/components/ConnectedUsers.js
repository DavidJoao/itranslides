import React, { useState, useEffect } from 'react';
import { useAppContext } from './ContextProvider';

const ConnectedUsers = () => {

    const { connectedUsers } = useAppContext();

    const [connectedMenu, setConnectedMenu] = useState(false)

    return (
        <>
        <div className={`rounded bg-slate-600 w-[250px] h-[200px] flex flex-col items-center justify-start p-2 text-white gap-3 ${connectedMenu === false ? 'hidden' : ''} mb-2`}>
        </div>
        <button className='bg-slate-600 text-white rounded p-1 w-[100px]' onClick={() => setConnectedMenu(!connectedMenu)}>Active Users</button>
        </>
    );
};

export default ConnectedUsers;
