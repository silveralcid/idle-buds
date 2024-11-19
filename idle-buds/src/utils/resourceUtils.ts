import { treesData } from "../data/resources/trees.data";
import { ResourceType } from "../enums/resource.enums";


const getResourceTypeFromData = (id: string, resourceType: ResourceType) => {
    switch (resourceType) {
      case ResourceType.LOGS:
        return treesData[id];
      default:
        return undefined;
    }
  };

export { getResourceTypeFromData };