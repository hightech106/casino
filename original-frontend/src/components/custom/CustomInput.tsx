import Input from "./Input";

interface Props {
    value: string | number;
    onChange?: (e: any) => void;
    disabled?: boolean;
    icon?: any;
    label?: string,
    type?: string
}

const CustomInput = (props: Props) => {
    const { value, onChange, disabled, icon, label, type = "number" } = props;

    return (
        <div className="mt-3">
            {
                label && <p
                    className="text-sm text-[#bebebe]  font-bold"
                >
                    {label}
                </p>
            }
            <Input value={value} onChange={onChange} disabled={disabled} icon={icon} type={type} />
        </div>
    )
};

export default CustomInput;