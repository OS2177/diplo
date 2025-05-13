import { CorbadoProvider } from '@corbado/react-sdk';
import { englishTranslations } from './translations'; // Make sure to have your translations defined

export default function WrappedCorbadoProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    // Obtain the Corbado project ID from the environment variables
    const projectId = process.env.NEXT_PUBLIC_CORBADO_PROJECT_ID;
    
    if (!projectId) {
        throw new Error("Missing Corbado project ID");
    }

    return (
        <CorbadoProvider
            projectId={projectId}
            // Enable dark mode for the Corbado UI
            darkMode="on"
            // Apply your custom styles to the Corbado UI
            theme="cbo-custom-styles"
            // Use custom translations
            customTranslations={{ en: englishTranslations }}
        >
            {children}
        </CorbadoProvider>
    );
}
