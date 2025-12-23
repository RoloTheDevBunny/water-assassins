"use client";
import BackLinkComponent from "@/components/v1/BackLink";
import OAuth from "@/components/v1/OAuth";
import { ROUTES } from "@/constants/routes-constants";
import { useI18n } from "@/contexts/i18nContext";

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
