import { useRef, useState } from "react";
import { Icon } from "@vincentbcp/components-library";
import { IDynamicForm } from "@vincentbcp/dynamic-form/dist/interfaces/IDynamicForm";
import { IDynamicFormField } from "@vincentbcp/dynamic-form/dist/interfaces/IDynamicFormField";
import { DynamicForm } from "@vincentbcp/dynamic-form";

const App = () => {
  const [form, setForm] = useState<IDynamicForm>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const transformRawForm = (formJSON: any) => {
    const formFields: [IDynamicFormField[]] = [[]];

    formJSON.rows.forEach((row: any, index: number) => {
      formFields[index] = row.fields.map((field: any) => {
        const type = field.key;

        // delete field["key"];
        delete field["rowId"];
        delete field["properties"];
        delete field["defaultValues"];

        return { ...field, type };
      });
    });

    return { name: formJSON.name, fields: formFields };
  };

  const handleUpload = (ev: React.ChangeEvent<HTMLInputElement>) => {
    var file = (ev.target.files || [])[0];

    if (!file) return;

    var reader = new FileReader();
    reader.onload = (e) => {
      try {
        setForm(transformRawForm(JSON.parse(e?.target?.result as string)));
      } catch (err) {}
    };
    reader.readAsText(file);
  };

  const handleBtnClick = () => {
    alert("clicked!");
  };

  if (!form) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center">
        <div
          className="flex flex-col items-center justify-center gap-4 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Icon icon="upload" size={64} />
          <span>Upload form</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={handleUpload}
            className="absolute top-[-1000px]"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-500 p-[1in] overflow-auto">
      <div className="flex flex-col w-[8.5in] min-h-[11in] mx-auto bg-white">
        <DynamicForm
          form={form}
          eventHandlers={[
            {
              fieldId: "BqoG8M6w",
              events: [{ propKey: "onClick", event: handleBtnClick }],
            },
          ]}
        />
      </div>
    </div>
  );
};

export default App;
