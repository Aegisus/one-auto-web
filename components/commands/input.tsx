import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { useEffect, useMemo, useRef } from "react";
import { useSelectedKeysStore } from "../../config/store";
import { EditorView, basicSetup } from "codemirror";
import { yaml } from "@codemirror/lang-yaml";
import { keymap } from "@codemirror/view";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import { oneDark } from "@codemirror/theme-one-dark"; // Import dark theme

interface InputAreaProps {
  commands: string;
}

export default function InputArea({ commands }: InputAreaProps) {
  const selectedKeys = useSelectedKeysStore((state) => state.selectedKeys);
  const editorRef = useRef(null);

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", "),
    [selectedKeys]
  );

  useEffect(() => {
    if (editorRef.current) {
      const view = new EditorView({
        doc: commands,
        extensions: [
          basicSetup,
          yaml(),
          keymap.of([...defaultKeymap, indentWithTab]), // Default keymap with indent using Tab
          oneDark, // Apply the dark theme
        ],
        parent: editorRef.current,
      });

      return () => view.destroy();
    }
  }, [commands]);

  return (
    <div className="flex flex-col gap-4 w-full mb-6">
      <Card className="relative p-4">
        <CardHeader className="flex justify-between">
          <div className="text-lg font-semibold">{`Commands for ${selectedValue}`}</div>
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
    </div>
  );
}
