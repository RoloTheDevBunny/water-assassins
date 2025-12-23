"use client";

import { useRouter } from "next/navigation";

import { useReducer } from "react";

import { SignInBridge } from "@/bridges/signin";
import BackLinkComponent from "@/components/v1/BackLink";
import ButtonComponent from "@/components/v1/Button";
import FooterAuthScreenComponent from "@/components/v1/FooterAuthScreen";
import InputComponent from "@/components/v1/Input";
import OAuth from "@/components/v1/OAuth";
import { ROUTES } from "@/constants/routes-constants";
import { useI18n } from "@/contexts/i18nContext";
import { isValidEmail } from "@/utils/isValidEmail";

const initialState = {
  isLoading: false,
  inputValue: {
    email: "",
    password: "",
  },
  errors: {
    email: "",
    password: "",
    general: "",
  },
};

export type SignInStateType = typeof initialState;

export type SignInAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_INPUT_VALUE"; payload: { email?: string; password?: string } }
  | {
    type: "SET_ERRORS";
    payload: { email?: string; password?: string; general?: string };
  };

function reducer(state: SignInStateType, action: SignInAction) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_INPUT_VALUE":
      return {
        ...state,
        inputValue: { ...state.inputValue, ...action.payload },
      };
    case "SET_ERRORS":
      return { ...state, isLoading: false, errors: { ...state.errors, ...action.payload } };
    default:
      return state;
  }
}

export default function SignIn() {
  const { translate } = useI18n("pages.signin");

  return (
    <>
      <BackLinkComponent href={ROUTES.home} label={translate("actions.back")} />
      <h2 className="text-2xl font-semibold text-center text-gray-900">
        {translate("title")}
      </h2>
      <p className="text-center text-sm text-gray-600">
        {translate("description")}
      </p>
      <OAuth />
    </>
  );
}
