declare module "@jmserrano/react-app-location" {
    import { Schema } from "yup";
    import {
      RouteProps,
    } from "react-router";

    type YupParams = Record<string, Schema<any>>;

    export default class Location<TParams = {}, TState = {}> {
      path: string;
      constructor(params: {
        path: string,
        pathParamDefs?: YupParams,
        queryStringParamDefs?: YupParams,
        invalid: React.ComponentType
      });
      toUrl(params?: TParams): string;
      toUrlWithState(params?: TParams, state?: TState): { path: string; state: TState };
      toLink(
        children?: string | Function | Node | JSX.Element | React.ReactNode,
        params?: TParams,
        props?: object
      ): Element;
      toRoute(params: RouteProps): JSX.Element;
      parseLocationParams(location?: object, match?: object): TParams;
      isValidParams(params?: TParams): boolean;
      toUrlEndingIn(params?: TParams): string;
    }
  }