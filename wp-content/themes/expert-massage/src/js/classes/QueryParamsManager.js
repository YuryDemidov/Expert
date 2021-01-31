export default class QueryParamsManager {
  getParamFromGET(key, queryString) {
    queryString = queryString === undefined ? globalThis.location.search : queryString;

    let result;
    if (queryString !== ``) {
      const getParams = queryString.replace(`?`, ``).split(`&`);
      getParams.forEach(param => {
        const pair = param.split(`=`);
        if (pair[0] === key) {
          result = pair[1];
        }
      });
    }

    return result;
  }

  setParamInGET(key, val, queryString) {
    queryString = queryString === undefined ? globalThis.location.search : queryString;

    let result = ``;
    let isFindKey = false;

    if (queryString !== `` && queryString !== `?`) {
      const getParams = queryString.replace(`?`, ``).split(`&`);
      for (let i = 0; i < getParams.length; i++) {
        const pair = getParams[i].split(`=`);
        if (pair[0] === key) {
          isFindKey = true;
          getParams[i] = [key, val].join(`=`);
          break;
        }
      }

      if (!isFindKey) {
        getParams.push([key, val].join(`=`));
      }
      result = `?` + getParams.join(`&`);
    } else {
      result = `?` + [key, val].join(`=`);
    }

    return result;
  }

  deleteParamFromGET(key, queryString) {
    queryString = queryString === undefined ? globalThis.location.search : queryString;

    let result = `?`;
    let isFindKey = -1;

    if (queryString !== ``) {
      const getParams = queryString.replace(`?`, ``).split(`&`);
      for (let i = 0; i < getParams.length; i++) {
        const pair = getParams[i].split(`=`);
        if (pair[0] === key) {
          isFindKey = i;
          break;
        }
      }

      if (isFindKey !== -1) {
        getParams.splice(isFindKey, 1);
      }
      result = `?` + getParams.join(`&`);
    }

    return result;
  }
}
