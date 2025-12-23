import { OAuthBridge } from "@/bridges/oauth";
import { PROVIDERS_IMAGE_URL } from "@/constants/providers-image-url";

export default function OAuth() {
  const oauthBridge = new OAuthBridge();

  const handleLogin = async (provider: "google" | "facebook" | "twitter") => {
    try {
      const { response } = await oauthBridge.execute(provider);
      if (response?.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      console.error("OAuth ERROR:", error);
    }
  };

  const PROVIDERS_MAP = [
    {
      provider: "Google",
      logo: PROVIDERS_IMAGE_URL.Google,
      onClick: () => handleLogin("google"),
    },
  ];

  return (
    <>
      <div className="mt-4 flex justify-center space-x-4">
        {PROVIDERS_MAP.map(({ provider, logo, onClick }) => (
          <ProviderButton
            key={provider}
            provider={provider}
            logo={logo}
            onClick={onClick}
          />
        ))}
      </div>
    </>
  );
}

type ProviderButtonProps = {
  provider: string;
  logo: string;
  onClick: () => void;
};

function ProviderButton({ provider, logo, onClick }: ProviderButtonProps) {
  return (
    <button
      className="
  p-4
  border-2 border-gray-400
  rounded-2xl
  bg-white
  hover:bg-gray-100
  focus-visible:ring-4
  focus-visible:ring-gray-400
  focus-visible:ring-offset-2
  focus-visible:ring-offset-white
"
      onClick={onClick}
    >
      <img src={logo} alt={provider} className="w-25 h-auto" />
    </button>
  );
}
