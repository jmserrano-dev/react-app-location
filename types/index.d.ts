declare module "@jmserrano/react-app-location" {
    import { Schema } from "yup";
    import {
      RouteComponentProps,
      RouteChildrenProps,
      RouteProps,
      StaticContext,
    } from "react-router";

    type YupParams = Record<string, Schema<any>>;
  
    export interface IRouteComponentProps<TParams, TState = any>
      extends RouteComponentProps<TParams, StaticContext, TState> {}
  
    export default class Location<TParams = {}, TState = {}> {
      constructor(params: {
        path: string,
        pathParamDefs?: YupParams,
        queryStringParamDefs?: YupParams,
        invalid: React.ComponentType
      });
      path: string;
      toUrl(params?: TParams): string;
      toUrlWithState(params?: TParams, state?: TState): { path: string; state: TState };
      toLink(
        children?: string | Function | Node | JSX.Element | React.ReactNode,
        params?: TParams,
        props?: object
      ): Element;
      toRoute(
        renderOptions: {
          component?:
            | React.ComponentType<RouteComponentProps<any>>
            | React.ComponentType<any>;
          render?: (props: RouteComponentProps<any>) => React.ReactNode;
          children?:
            | ((props: RouteChildrenProps<any>) => React.ReactNode)
            | React.ReactNode;
        },
        exact?: boolean,
        strict?: boolean,
        sensitive?: boolean
      ): JSX.Element;
      toDefaultRoute(params: RouteProps): JSX.Element;
      parseLocationParams(location?: object, match?: object): TParams;
      isValidParams(params?: TParams): boolean;
      toUrlEndingIn(params?: TParams): string;
    }
  }