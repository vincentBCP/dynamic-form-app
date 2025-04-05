import { useRef, useState } from "react";
import { Icon } from "@vincentbcp/components-library";
import { IDynamicForm } from "@vincentbcp/dynamic-form/dist/interfaces/IDynamicForm";
import { IDynamicFormField } from "@vincentbcp/dynamic-form/dist/interfaces/IDynamicFormField";
import { DynamicForm } from "@vincentbcp/dynamic-form";
import { IFormValue } from "@vincentbcp/dynamic-form/dist/interfaces/IFormValue";
import random from "random-string-generator";

const App = () => {
  const [form, setForm] = useState<IDynamicForm>();
  const [formValue, setFormValue] = useState<IFormValue | IFormValue[]>();

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

        return {
          ...field,
          type,
          value:
            type === "subForm" ? transformRawForm(field.value) : field.value,
        };
      });
    });

    return {
      id: formJSON.id,
      name: formJSON.name,
      list: formJSON.list,
      fields: formFields,
    };
  };

  const handleUpload = (ev: React.ChangeEvent<HTMLInputElement>) => {
    var file = (ev.target.files || [])[0];

    if (!file) return;

    var reader = new FileReader();
    reader.onload = (e) => {
      try {
        const form = transformRawForm(JSON.parse(e?.target?.result as string));
        setForm(form);
        setFormValue(form.list ? [] : { id: random(8), formId: form.id });
      } catch (err) {}
    };
    reader.readAsText(file);
  };

  const handleBtnClick = () => {
    console.log(formValue);
  };

  if (!form || !formValue) {
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
              fieldId: "VLgxrvUL",
              events: [{ propKey: "onClick", event: handleBtnClick }],
            },
            {
              fieldId: "AbZ7n51f",
              events: [{ propKey: "onClick", event: handleBtnClick }],
            },
          ]}
          formValue={formValue}
          onChange={setFormValue}
        />
      </div>
    </div>
  );
};

export default App;
