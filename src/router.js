import React from "react";
import { Router, Route, Switch } from "dva/router";
import dynamics from "dva/dynamic";
import { isfalse } from "./utils/utils";
function RouterConfig({ history, app }) {
  const routes = [
    {
      path: "/",
      models: () => [import('./models/common')],
      component:()=> import('./components/member/memberIndex')
    },
    {
      path: "/index",
      match: "match",
      models: () => [import("./models/common"),import("./models/example")],
      component:()=> import('./components/member/memberIndex')
    },
    {
      path: "/page02",
      models: () => [import("./models/wechatinit")],
      component: () => import("./routes/page02")
    },
    {
      path: '/user',
      match:'match',
      component: () => import('./routes/user'),
    },
    {
      path: '/accountChild/accountChild',
      models: () => [import("./models/AccountChildModel")],
      component: () => import('./routes/accountChild/accountChild.jsx'),
    },
    {
      path: '/accountChild/accountChildView',
      models: () => [import("./models/AccountChildModel")],
      component: () => import('./routes/accountChild/accountChildView.jsx'),
    },
    {
      path: "/payApproval",
      models: () => [import("./models/payApprovalModel/payApproval"), import("./models/common")],
      component: () => import("./routes/payApproval/payApproval.jsx")
    },
    {
      path: "/payApproval/payApprovalDetails",
      models: () => [import("./models/payApprovalModel/payApproval"), import("./models/common")],
      component: () => import("./routes/payApproval/payApprovalDetails.jsx")
    },
    {
      path: "/payApproval/waitProcess",
      models: () => [import("./models/payApprovalModel/payApproval"), import("./models/common")],
      component: () => import("./routes/payApproval/waitProcess.jsx")
    },
    {
      path: "/projectStatistics",
      models: () => [import("./models/projectStatistics")],
      component: () =>
        import("./routes/projectStatistics/projectStatistics.jsx")
    },
    {
      path: "/bidApproval/bidApproval",
      models: () => [import("./models/bidApprovalModel/bidApproval"),import('./models/common')],
      component: () => import("./routes/bidApproval/bidApproval.jsx")
    },
    {
      path: "/bidApproval/waitBidApproval",
      models: () => [import("./models/bidApprovalModel/bidApproval"), import("./models/common")],
      component: () => import("./routes/bidApproval/waitBidApproval.jsx")
    },
    {
      path: "/bidApproval/bidApprovalView",
      models: () => [import("./models/bidApprovalModel/bidApproval"), import("./models/common")],
      component: () => import("./routes/bidApproval/bidApprovalView.jsx")
    },
    {
      path: "/processCenter/waitProcessList",
      models: () => [import("./models/processCenterModel/waitProcessModel")],
      component: () => import("./routes/processCenter/waitProcessList.jsx")
    },
    {
      path: "/mytender",
      models: () => [import("./models/tenderModel/tender"), import("./models/common")],
      component: () => import("./routes/mytender")
    },
    {
      path: "/processCenter/myProcessList",
      models: () => [import("./models/processCenterModel/myProcessModel")],
      component: () => import("./routes/processCenter/myProcessList.jsx")
    },
    {
      path: "/processCenter/doneProcessList",
      models: () => [import("./models/processCenterModel/doneProcessModel")],
      component: () => import("./routes/processCenter/doneProcessList.jsx")
    },
    {
      path: "/infoCenter/infoCenterList",
      models: () => [import("./models/infoCenterModel")],
      component: () => import("./routes/infoCenter/infoCenterList.jsx")
    },
    {
      path: "/infoCenter/infoCenterView",
      models: () => [import("./models/infoCenterModel")],
      component: () => import("./routes/infoCenter/infoCenterView.jsx")
    },
    {
      path: '/materialList',
      models: () => [import('./models/supplier'),import('./models/common')],
      component: () => import('./components/supplier/materialList'),
    },
    {
      path: '/materialDetails',
      models: () => [import('./models/supplier'),import('./models/common')],
      component: () => import('./components/supplier/materialDetails'),
    },
    {
      path: '/labourList',
      models: () => [import('./models/supplier'),import('./models/common')],
      component: () => import('./components/supplier/labourList'),
    },

    {
      path: '/labourDetails',
      models: () => [import('./models/supplier'),import('./models/common')],
      component: () => import('./components/supplier/labourDetails'),
    },
    {
      path: '/addSupplier',
      models:()=>[import('./models/supplier')],
      component: () => import('./components/supplier/addSupplier'),
    },
    {
      path:'/memberIndex',
      models: () => [import('./models/common')],
      component:()=> import('./components/member/memberIndex')
    },
    {
      path: "/answer/answerList",
      models: () => [import("./models/answerModal")],
      component: () => import("./routes/answer/answerList.jsx")

    },
    {
      path: "/processCenter/startProcess",
      models: () => [import("./models/processCenterModel/startProcessModel")],
      component: () => import("./routes/processCenter/startProcess.jsx")

    },
    {
      path:"/bootPage",
      component:()=> import("./components/member/bootPage")
    },
    {
      path: "/bidApproval/UploadContract",
      models: () => [import("./models/bidApprovalModel/bidApproval"), import("./models/common")],
      component: () => import("./routes/bidApproval/UploadContract.jsx")
    },
    {
      path: "/bidApproval/ContractView",
      models: () => [import("./models/bidApprovalModel/bidApproval"), import("./models/common")],
      component: () => import("./routes/bidApproval/ContractView.jsx")
    },
    {
      path: "/bidApproval/programme",
      models: () => [import("./models/bidApprovalModel/bidApproval"), import("./models/common")],
      component: () => import("./routes/bidApproval/programme.jsx")
    },
  ];
  // React-router4嵌套写法有调整，仅仅适用于4.0以下
  function descRouter(routes) {
    return routes.map(({ path, ...dynamic }, key) => {
      return (
        <Route
          key={key}
          match={dynamic.match || false}
          exact={isfalse(dynamic.match)}
          path={path}
          component={dynamics({ app, ...dynamic })}
        />
      );
    });
  }
  return (
    <Router history={history}>
      <Switch>
        {descRouter(routes)}
        {/*<Route path="/" exact component={IndexPages} />
         <Route exact path="/page01" component={Page01} />
         <Route exact path="/page02" component={Page02} />
         <Route exact path="/page03" component={Page03} />
         <Route exact path="/materialList" component={MaterialList} />
         <Route exact path="/materialDetails" component={MaterialDetails} />
         <Route exact path="/addSupplier" component={AddSupplier} />*/}

      </Switch>
    </Router>
  );
}

export default RouterConfig;
