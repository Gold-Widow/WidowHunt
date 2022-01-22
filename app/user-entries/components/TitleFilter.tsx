import Form from "app/core/components/Form"
import LabeledTextField from "app/core/components/LabeledTextField"
import { FC, useState } from "react"

export const TitleFilter: FC<{ onChange: (newTitleFilter: string) => void }> = ({ onChange }) => {
  const [value, setValue] = useState("")
  return (
    <Form onSubmit={() => {}}>
      <LabeledTextField
        label="Title contains"
        type="text"
        onChange={(evt) => {
          setValue(evt.target.value)
          onChange(evt.target.value)
        }}
        name="entry-title-filter"
        value={value}
      />
    </Form>
  )
}
