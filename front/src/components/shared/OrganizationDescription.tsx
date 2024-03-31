import { Button } from "@/components/ui";

interface StabBlockProps {
    value: string | number;
    label: string;
  }
  
const StatBlock = ({ value, label }: StabBlockProps) => (
<div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-dark-2">{label}</p>
</div>
);

const OrganizationDescription = ({organisation}) => {
    return (
        <div className="profile-inner_container">
            <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
            <img
                src={organisation.organization_image || "/assets/icons/profile-placeholder.svg"} 
                alt="profile"
                className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
            />
            <div className="flex flex-col flex-1 justify-between md:mt-2">
                <div className="flex flex-col w-full">
                    <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                        {organisation.organization_name}
                    </h1>
                </div>

                <div className="flex gap-8 mt-6 items-center justify-center xl:justify-start flex-wrap">
                {organisation.events.length%10 === 1 ? (
                    <StatBlock value={organisation.events.length} label="Подія" />
                ) : (
                    organisation.events.length%10 === 2 || organisation.events.length%10 === 3 || organisation.events.length%10 === 4 ? (
                    <StatBlock value={organisation.events.length} label="Події" />
                    ) : (
                    <StatBlock value={organisation.events.length} label="Подій" />
                    )
                )}
                </div>

                <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
                    {organisation.organization_desc}
                </p>
            </div>

            <div className="flex-col justify-center gap-4">
                </div>
            </div>
        </div>
    )
}

export default OrganizationDescription;
