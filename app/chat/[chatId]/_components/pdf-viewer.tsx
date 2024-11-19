import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import type {
  ToolbarSlot,
  TransformToolbarSlot,
} from "@react-pdf-viewer/toolbar";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";

interface PDFViewerProps {
  pdfUrl: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl }) => {
  const toolbarPluginInstance = toolbarPlugin();
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const { renderDefaultToolbar, Toolbar } = toolbarPluginInstance;

  const transform: TransformToolbarSlot = (slot: ToolbarSlot) => ({
    ...slot,
    Download: () => <></>,
    SwitchTheme: () => <></>,
    Open: () => <></>,
  });

  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
      <div className="w-full h-[90vh] flex flex-col text-white !important">
        <div
          className="align-center bg-[#eeeeee] flex p-1"
          style={{
            borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
          }}
        >
          <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>
        </div>
        <Viewer
          fileUrl={pdfUrl}
          plugins={[toolbarPluginInstance, pageNavigationPluginInstance]}
        />
      </div>
    </Worker>
  );
};

export default PDFViewer;
