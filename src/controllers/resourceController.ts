export default function resourceController(resourceService) {

  return {
    doControllerAction(request, reply) {
      // [... transport logic]
      return resourceService.doAction(request.params).then(reply);
    }
  };
}
