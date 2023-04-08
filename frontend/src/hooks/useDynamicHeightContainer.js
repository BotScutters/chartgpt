// hooks/useDynamicHeightContainer.js
import { useState } from 'react';

/**
 * A custom React hook to manage a dynamic height container with multiple resizable subcontainers.
 *
 * @param {number} numContainers - The number of subcontainers.
 * @param {number[]} initialSizes - An array of initial sizes for the subcontainers (in percentages).
 * @param {number} minHeight - The minimum height for each subcontainer (in percentages).
 * @param {React.RefObject} containerRef - A reference to the container element.
 * @returns {[number[], (sliderIndex: number, deltaY: number) => number]} - An array containing the current container sizes and a function to handle resizing.
 */
export const useDynamicHeightContainer = (numContainers, initialSizes, minHeight, containerRef) => {
    const [containerSizes, setContainerSizes] = useState(initialSizes);
    const minSize = minHeight;
    const maxSize = 100 - minSize * (numContainers - 1);

    /**
     * Handles resizing containers when a slider is dragged.
     *
     * @param {number} sliderIndex - The index of the slider being dragged.
     * @param {number} deltaY - The change in the slider's vertical position in pixels.
     * @returns {number} - The actual change in the slider's vertical position after clamping container sizes.
     */
    const handleResize = (sliderIndex, deltaY) => {
        const containerHeight = containerRef.current.clientHeight;
        const deltaYPerc = (deltaY / containerHeight) * 100;
        const newContainerSizes = [...containerSizes];

        /**
         * Adjusts the size of the specified container by the given delta, clamping
         * the new size within the range [minSize, maxSize].
         *
         * @param {number} containerIndex - The index of the container to be adjusted.
         * @param {number} delta - The amount to change the container size by, in percentage.
         * @returns {number} - The actual applied delta after clamping the new size.
         */
        const adjustContainer = (containerIndex, delta) => {
            if (containerIndex < 0 || containerIndex >= numContainers) {
                return 0;
            }
            const newSize = newContainerSizes[containerIndex] + delta;
            const clampedSize = Math.max(minSize, Math.min(newSize, maxSize));
            const appliedDelta = clampedSize - newContainerSizes[containerIndex];
            newContainerSizes[containerIndex] = clampedSize;
            return appliedDelta;
        };

        /**
         * Adjusts the size of the container at the specified index by the given delta,
         * if the new size is within the range [minSize, maxSize]. If the new size is
         * outside the range, the delta is adjusted to the maximum possible value, and
         * the remaining delta is applied to the following container(s) recursively.
         * 
         * @param {number} containerIndex - The index of the container to start adjusting from.
         * @param {number} delta - The amount to change the following container(s) by, in percentage.
         * @param {number} direction - The direction to adjust the following container(s) in. Either 1 or -1.
         * @returns {number} finalAppliedDelta - The total delta applied to the following containers.
         */
        const adjustContainersAhead = (containerIndex, delta, direction) => {
            if (delta === 0 || containerIndex < 0 || containerIndex >= numContainers) {
                return 0;
            }
            const appliedDelta = adjustContainer(containerIndex, -direction * delta);
            const remainingDelta = delta + direction * appliedDelta;
            const aheadAppliedDelta = adjustContainersAhead(
                containerIndex + direction, remainingDelta, direction);
            const finalAppliedDelta = appliedDelta + aheadAppliedDelta;
            return finalAppliedDelta;
        }

        const deltaPos = deltaYPerc >= 0;
        const direction = deltaPos ? 1 : -1;

        // adjust containers ahead of the direction of sliding
        const appliedDeltaAhead = adjustContainersAhead(
            sliderIndex + deltaPos, deltaYPerc, direction);
        // adjust the container preceding the slider
        const appliedDeltaBehind = adjustContainer(
            sliderIndex + !deltaPos, -appliedDeltaAhead);
        setContainerSizes(newContainerSizes);
        const finalDeltaY = -direction * appliedDeltaAhead * (containerHeight / 100);
        return finalDeltaY;
    };

    return [containerSizes, handleResize];
};
