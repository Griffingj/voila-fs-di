module.exports = function resourceService(resourceDao) {

  return {
    doServiceAction(params) {
      // [... business logic]
      return resourceDao.doDaoAction(params);
    }
  };
}
