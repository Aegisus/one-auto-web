import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useSelectedKeysStore } from "../../config/store";
import { EditorView, basicSetup } from "codemirror";
import { yaml } from "@codemirror/lang-yaml";
import { keymap } from "@codemirror/view";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import { oneDark } from "@codemirror/theme-one-dark"; // Import dark theme
import Notifications from "@/components/device/notifications";
import { updateFunctions } from "@/stores/useDeviceActionsStore"; // Adjust the import according to your project structure
import * as jsYaml from "js-yaml";

interface InputAreaProps {
  functions: string;
  setFunctions: React.Dispatch<React.SetStateAction<string>>;
}

function yamlToJson(yamlStr: string): object {
  try {
    const jsonObj = jsYaml.load(yamlStr) as object;
    return jsonObj;
  } catch (e) {
    console.error("Error converting YAML to JSON:", e);
    throw e;
  }
}
export default function FunctionInputArea({
  functions,
  setFunctions,
}: InputAreaProps) {
  const selectedKeys = useSelectedKeysStore((state) => state.selectedKeys);
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "fail" | "warning";
    content: string;
  } | null>(null);

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", "),
    [selectedKeys]
  );

  const selectedValueRef = useRef(selectedValue);
  const commandsRef = useRef(functions);

  useEffect(() => {
    selectedValueRef.current = selectedValue;
  }, [selectedValue]);

  useEffect(() => {
    commandsRef.current = functions;
  }, [functions]);

  const handleUpdateFunctions = useCallback(async () => {
    const currentSelectedValue = selectedValueRef.current;
    const currentFunctions = commandsRef.current;
    try {
      await updateFunctions(currentSelectedValue, yamlToJson(currentFunctions));
      setNotification({
        type: "success",
        content: "Functions updated successfully",
      });
    } catch (error) {
      setNotification({ type: "fail", content: "Failed to update functions" });
    }
  }, []);

  useEffect(() => {
    if (editorRef.current && !viewRef.current) {
      viewRef.current = new EditorView({
        doc: functions,
        extensions: [
          basicSetup,
          yaml(),
          keymap.of([
            ...defaultKeymap,
            indentWithTab,
            {
              key: "Ctrl-s",
              run: () => {
                handleUpdateFunctions();
                return true;
              },
            },
          ]), // Default keymap with indent using Tab and Ctrl+S shortcut
          oneDark, // Apply the dark theme
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              setFunctions(update.state.doc.toString());
            }
          }),
        ],
        parent: editorRef.current,
      });
    }
  }, [setFunctions, handleUpdateFunctions]);

  useEffect(() => {
    if (viewRef.current) {
      const currentView = viewRef.current;
      const currentDoc = currentView.state.doc.toString();
      if (currentDoc !== functions) {
        currentView.dispatch({
          changes: { from: 0, to: currentDoc.length, insert: functions },
        });
      }
    }
  }, [functions]);

  return (
    <div className="flex flex-col gap-4 w-full mb-6">
      <Card className="relative p-4">
        <CardHeader className="flex justify-between">
          <div className="text-lg font-semibold">{`Functions for ${selectedValue}`}</div>
        </CardHeader>
        <Divider />
        <CardBody>
          <div
            ref={editorRef}
            style={{
              width: "100%",
              height: "100%",
              background: "transparent",
            }}
          />
        </CardBody>
      </Card>
      {notification && (
        <Notifications
          type={notification.type}
          content={notification.content}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
