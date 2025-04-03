import { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const nodeRef = useRef(null);

  // All official Indian languages with ISO codes
  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिन्दी (Hindi)" },
    { code: "bn", name: "বাংলা (Bengali)" },
    { code: "te", name: "తెలుగు (Telugu)" },
    { code: "mr", name: "मराठी (Marathi)" },
    { code: "ta", name: "தமிழ் (Tamil)" },
    { code: "ur", name: "اردو (Urdu)" },
    { code: "gu", name: "ગુજરાતી (Gujarati)" },
    { code: "kn", name: "ಕನ್ನಡ (Kannada)" },
    { code: "or", name: "ଓଡ଼ିଆ (Odia)" },
    { code: "pa", name: "ਪੰਜਾਬੀ (Punjabi)" },
    { code: "ml", name: "മലയാളം (Malayalam)" },
    { code: "as", name: "অসমীয়া (Assamese)" },
    { code: "mai", name: "मैथिली (Maithili)" },
    { code: "sat", name: "ᱥᱟᱱᱛᱟᱲᱤ (Santali)" },
    { code: "ks", name: "कॉशुर (Kashmiri)" },
    { code: "ne", name: "नेपाली (Nepali)" },
    { code: "sd", name: "सिंधी (Sindhi)" },
    { code: "kok", name: "कोंकणी (Konkani)" },
    { code: "doi", name: "डोगरी (Dogri)" },
    { code: "mni", name: "মৈতৈলোন্ (Manipuri)" },
    { code: "bho", name: "भोजपुरी (Bhojpuri)" },
  ];

  useEffect(() => {
    // Load Google Translate script dynamically
    const addGoogleTranslateScript = () => {
      if (!document.getElementById("google-translate-script")) {
        const script = document.createElement("script");
        script.id = "google-translate-script";
        script.src =
          "https://translate.google.com/translate_a/element.js?cb=googleTranslateInit";
        script.async = true;
        document.body.appendChild(script);
      }
    };

    window.googleTranslateInit = () => {
      new window.google.translate.TranslateElement(
        { 
          pageLanguage: "en", 
          autoDisplay: false,
          layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
          includedLanguages: languages.map(l => l.code).join(',')
        },
        "google_translate_element"
      );
    };

    addGoogleTranslateScript();

    // Mutation observer to hide Google elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const elements = document.querySelectorAll(
          '.goog-te-banner-frame, .goog-te-ftab-link, .goog-te-gadget-icon, .goog-te-combo'
        );
        elements.forEach(element => {
          (element as HTMLElement).style.display = 'none';
          (element as HTMLElement).style.height = '0';
          (element as HTMLElement).style.visibility = 'hidden';
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    });

    return () => observer.disconnect();
  }, []);

  const handleLanguageSelect = (langCode: string) => {
    setSelectedLanguage(langCode);
    setIsOpen(false);

    // Set Google Translate language
    const googleTranslateDropdown: HTMLSelectElement | null =
      document.querySelector(".goog-te-combo");

    if (googleTranslateDropdown) {
      googleTranslateDropdown.value = langCode;
      googleTranslateDropdown.dispatchEvent(new Event("change"));
      localStorage.setItem("preferredLang", langCode);
      document.documentElement.lang = langCode;
    }
  };

  return (
    <Draggable nodeRef={nodeRef} defaultPosition={{ x: 20, y: -100 }}>
      <div ref={nodeRef} className="language-widget">
        {/* Floating Button */}
        <div className="floating-btn" onClick={() => setIsOpen(!isOpen)}>
          🇮🇳
        </div>

        {/* Language Selection Panel */}
        {isOpen && (
          <div className="language-panel">
            <div className="language-list">
              {languages.map((lang) => (
                <div
                  key={lang.code}
                  className={`language-item ${
                    selectedLanguage === lang.code ? "selected" : ""
                  }`}
                  onClick={() => handleLanguageSelect(lang.code)}
                >
                  {lang.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Google Translate Hidden */}
        <div id="google_translate_element" style={{ display: "none" }}></div>

        {/* Inline Styles */}
        <style>{`
          .language-widget {
            position: fixed;
            z-index: 1000;
            cursor: move;
            bottom: 20px;
            right: 20px;
            font-family: 'Noto Sans', Arial, sans-serif;
          }

          .floating-btn {
            width: 50px;
            height: 50px;
            background-color: #FF9933;
            color: white;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
          }

          .floating-btn:hover {
            background-color: #FF5722;
            transform: scale(1.1);
          }

          .language-panel {
            position: absolute;
            bottom: 60px;
            right: 0;
            background: white;
            padding: 10px;
            border-radius: 8px;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
            width: 220px;
            max-height: 60vh;
            overflow-y: auto;
          }

          .language-list {
            display: flex;
            flex-direction: column;
            gap: 5px;
          }

          .language-item {
            padding: 8px;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s ease;
            font-size: 14px;
          }

          .language-item:hover {
            background-color: #f0f0f0;
          }

          .language-item.selected {
            background-color: #e0e0e0;
            font-weight: bold;
          }

          /* Google Translate Element Hiding */
          .goog-te-banner-frame,
          .goog-te-ftab-link,
          .goog-te-gadget-icon,
          .goog-te-combo,
          .goog-tooltip {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            width: 0 !important;
            opacity: 0 !important;
          }

          body {
            top: 0 !important;
          }

          /* Scrollbar Styling */
          .language-panel::-webkit-scrollbar {
            width: 6px;
          }

          .language-panel::-webkit-scrollbar-track {
            background: #f1f1f1;
          }

          .language-panel::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 3px;
          }
        `}</style>
      </div>
    </Draggable>
  );
};

export default LanguageSelector;