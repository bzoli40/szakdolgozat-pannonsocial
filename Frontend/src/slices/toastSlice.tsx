import { createSlice } from "@reduxjs/toolkit";
import { cssTransition, toast } from "react-toastify";
import okay_icon from '../images/icons/okay.png';
import wrong_icon from '../images/icons/wrong.png';
import info_icon from '../images/icons/info.png';

const ease_in_out = cssTransition({
    enter: "scale-up-hor-center",
    exit: "scale-down-hor-center"
})

export const toastSlice = createSlice({
    name: 'toast',
    initialState: {},
    reducers: {
        showToast: (state, action) => {

            var type = action.payload.type
            var message = action.payload.message

            switch (type) {
                case "error":
                    toast.error(message, {
                        position: "bottom-center",
                        //transition: ease_in_out,
                        icon: ({ theme, type }) => <img className='notification-icon' src={wrong_icon} />,
                        bodyClassName: "notification-message"
                    })
                    break;
                case "success":
                    toast.success(message, {
                        position: "bottom-center",
                        //transition: ease_in_out,
                        icon: ({ theme, type }) => <img className='notification-icon' src={okay_icon} />,
                        bodyClassName: "notification-message"
                    })
                    break;
                default:
                    toast.info(message, {
                        position: "bottom-center",
                        //transition: ease_in_out,
                        icon: ({ theme, type }) => <img className='notification-icon' src={info_icon} />,
                        bodyClassName: "notification-message"
                    })
                    break;
            }

        }
    }
});

export const { showToast } = toastSlice.actions;
export default toastSlice.reducer;