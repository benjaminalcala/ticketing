import { useEffect } from 'react';
import Router from 'next/router';

import useRequest from '../../hooks/use-request';

const SignOut = () => {

  const {doRequest} = useRequest({
    method: 'post', 
    url: '/api/users/signout', 
    body: {}, 
    onSuccess: () => Router.push('/')
  });

    useEffect((()=> {
      doRequest();
    }),[])

    return <div>Signing you out...</div>

}



export default SignOut;