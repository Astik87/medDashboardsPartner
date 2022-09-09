import React from "react";
import {useParams} from "react-router-dom";

const withRouter = (Child) => {
    return (props) => {
        const routeParams = useParams()

        return <Child {...props} routeParams={routeParams}  />
    }
}

export {
    withRouter
}
