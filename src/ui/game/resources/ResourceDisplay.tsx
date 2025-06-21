import React, { useEffect, useState } from "react";
import "./ResourceDisplay.css";
import { ResourceConfig } from "../../../game/logic/resources/ResourceConfig";
import { ResourceTracker } from "../../../game/logic/resources/ResourceTracker";
import { ResourceType } from "../../../game/logic/resources/ResourceType";
import { formatResourceNumber } from "./formatResourceNumber";

export const ResourceDisplay: React.FC = () => {
    const [values, setValues] = useState<Record<ResourceType, number>>(
        () =>
            Object.fromEntries(
                Object.values(ResourceType).map((key) => [key, 0]),
            ) as Record<ResourceType, number>,
    );

    useEffect(() => {
        const handle = (update: Partial<Record<ResourceType, number>>) => {
            setValues((prev) => ({ ...prev, ...update }));
        };
        ResourceTracker.subscribe(handle);
        return () => ResourceTracker.unsubscribe(handle);
    }, []);

    return (
        <div className="resource-display">
            {Object.values(ResourceType).map((type) => {
                const { icon, description } = ResourceConfig[type];
                const value = values[type];
                return (
                    <div
                        className="resource-row"
                        key={type}
                        title={description}
                    >
                        <img src={icon} alt={type} className="resource-icon" />
                        <span className="resource-value">
                            {formatResourceNumber(Math.round(value))}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};
