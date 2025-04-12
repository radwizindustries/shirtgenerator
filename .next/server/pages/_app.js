/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "(pages-dir-node)/./components/AuthProvider.js":
/*!************************************!*\
  !*** ./components/AuthProvider.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AuthProvider: () => (/* binding */ AuthProvider),\n/* harmony export */   useAuth: () => (/* binding */ useAuth)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _lib_supabase__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/supabase */ \"(pages-dir-node)/./lib/supabase.js\");\n/* __next_internal_client_entry_do_not_use__ AuthProvider,useAuth auto */ \n\n\n// Create the context with a default value\nconst AuthContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)({\n    user: null,\n    loading: true,\n    signIn: async ()=>({\n            data: null,\n            error: null\n        }),\n    signUp: async ()=>({\n            data: null,\n            error: null\n        }),\n    signOut: async ()=>{}\n});\nconst AuthProvider = ({ children })=>{\n    const [user, setUser] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)({\n        \"AuthProvider.useEffect\": ()=>{\n            // Check active sessions and sets the user\n            _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabase.auth.getSession().then({\n                \"AuthProvider.useEffect\": ({ data: { session } })=>{\n                    setUser(session?.user ?? null);\n                    setLoading(false);\n                }\n            }[\"AuthProvider.useEffect\"]);\n            // Listen for changes on auth state (signed in, signed out, etc.)\n            const { data: { subscription } } = _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabase.auth.onAuthStateChange({\n                \"AuthProvider.useEffect\": (_event, session)=>{\n                    setUser(session?.user ?? null);\n                    setLoading(false);\n                }\n            }[\"AuthProvider.useEffect\"]);\n            return ({\n                \"AuthProvider.useEffect\": ()=>subscription.unsubscribe()\n            })[\"AuthProvider.useEffect\"];\n        }\n    }[\"AuthProvider.useEffect\"], []);\n    const signIn = async (email, password)=>{\n        try {\n            console.log('Attempting to sign in with:', email);\n            const { data, error } = await _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabase.auth.signInWithPassword({\n                email,\n                password\n            });\n            console.log('Sign in response:', {\n                data,\n                error\n            });\n            if (error) {\n                console.error('Sign in error:', error);\n                return {\n                    data: null,\n                    error\n                };\n            }\n            return {\n                data,\n                error: null\n            };\n        } catch (error) {\n            console.error('Sign in error:', error);\n            return {\n                data: null,\n                error\n            };\n        }\n    };\n    const signUp = async (email, password, username)=>{\n        try {\n            const { data, error } = await _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabase.auth.signUp({\n                email,\n                password,\n                options: {\n                    data: {\n                        username: username\n                    }\n                }\n            });\n            if (error) {\n                console.error('Sign up error:', error);\n                return {\n                    data: null,\n                    error\n                };\n            }\n            return {\n                data,\n                error: null\n            };\n        } catch (error) {\n            console.error('Sign up error:', error);\n            return {\n                data: null,\n                error\n            };\n        }\n    };\n    const signOut = async ()=>{\n        try {\n            const { error } = await _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabase.auth.signOut();\n            if (error) throw error;\n        } catch (error) {\n            console.error('Sign out error:', error);\n            throw error;\n        }\n    };\n    const value = {\n        user,\n        loading,\n        signIn,\n        signUp,\n        signOut\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(AuthContext.Provider, {\n        value: value,\n        children: children\n    }, void 0, false, {\n        fileName: \"/Users/radicalwizard/Documents/GitHub/shirtgenerator/components/AuthProvider.js\",\n        lineNumber: 100,\n        columnNumber: 5\n    }, undefined);\n};\nconst useAuth = ()=>{\n    const context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(AuthContext);\n    if (context === undefined) {\n        throw new Error('useAuth must be used within an AuthProvider');\n    }\n    return context;\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL2NvbXBvbmVudHMvQXV0aFByb3ZpZGVyLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBRXNFO0FBQzVCO0FBRTFDLDBDQUEwQztBQUMxQyxNQUFNSyw0QkFBY0wsb0RBQWFBLENBQUM7SUFDaENNLE1BQU07SUFDTkMsU0FBUztJQUNUQyxRQUFRLFVBQWE7WUFBRUMsTUFBTTtZQUFNQyxPQUFPO1FBQUs7SUFDL0NDLFFBQVEsVUFBYTtZQUFFRixNQUFNO1lBQU1DLE9BQU87UUFBSztJQUMvQ0UsU0FBUyxXQUFhO0FBQ3hCO0FBRU8sTUFBTUMsZUFBZSxDQUFDLEVBQUVDLFFBQVEsRUFBRTtJQUN2QyxNQUFNLENBQUNSLE1BQU1TLFFBQVEsR0FBR1osK0NBQVFBLENBQUM7SUFDakMsTUFBTSxDQUFDSSxTQUFTUyxXQUFXLEdBQUdiLCtDQUFRQSxDQUFDO0lBRXZDRCxnREFBU0E7a0NBQUM7WUFDUiwwQ0FBMEM7WUFDMUNFLG1EQUFRQSxDQUFDYSxJQUFJLENBQUNDLFVBQVUsR0FBR0MsSUFBSTswQ0FBQyxDQUFDLEVBQUVWLE1BQU0sRUFBRVcsT0FBTyxFQUFFLEVBQUU7b0JBQ3BETCxRQUFRSyxTQUFTZCxRQUFRO29CQUN6QlUsV0FBVztnQkFDYjs7WUFFQSxpRUFBaUU7WUFDakUsTUFBTSxFQUFFUCxNQUFNLEVBQUVZLFlBQVksRUFBRSxFQUFFLEdBQUdqQixtREFBUUEsQ0FBQ2EsSUFBSSxDQUFDSyxpQkFBaUI7MENBQUMsQ0FBQ0MsUUFBUUg7b0JBQzFFTCxRQUFRSyxTQUFTZCxRQUFRO29CQUN6QlUsV0FBVztnQkFDYjs7WUFFQTswQ0FBTyxJQUFNSyxhQUFhRyxXQUFXOztRQUN2QztpQ0FBRyxFQUFFO0lBRUwsTUFBTWhCLFNBQVMsT0FBT2lCLE9BQU9DO1FBQzNCLElBQUk7WUFDRkMsUUFBUUMsR0FBRyxDQUFDLCtCQUErQkg7WUFDM0MsTUFBTSxFQUFFaEIsSUFBSSxFQUFFQyxLQUFLLEVBQUUsR0FBRyxNQUFNTixtREFBUUEsQ0FBQ2EsSUFBSSxDQUFDWSxrQkFBa0IsQ0FBQztnQkFDN0RKO2dCQUNBQztZQUNGO1lBRUFDLFFBQVFDLEdBQUcsQ0FBQyxxQkFBcUI7Z0JBQUVuQjtnQkFBTUM7WUFBTTtZQUUvQyxJQUFJQSxPQUFPO2dCQUNUaUIsUUFBUWpCLEtBQUssQ0FBQyxrQkFBa0JBO2dCQUNoQyxPQUFPO29CQUFFRCxNQUFNO29CQUFNQztnQkFBTTtZQUM3QjtZQUVBLE9BQU87Z0JBQUVEO2dCQUFNQyxPQUFPO1lBQUs7UUFDN0IsRUFBRSxPQUFPQSxPQUFPO1lBQ2RpQixRQUFRakIsS0FBSyxDQUFDLGtCQUFrQkE7WUFDaEMsT0FBTztnQkFBRUQsTUFBTTtnQkFBTUM7WUFBTTtRQUM3QjtJQUNGO0lBRUEsTUFBTUMsU0FBUyxPQUFPYyxPQUFPQyxVQUFVSTtRQUNyQyxJQUFJO1lBQ0YsTUFBTSxFQUFFckIsSUFBSSxFQUFFQyxLQUFLLEVBQUUsR0FBRyxNQUFNTixtREFBUUEsQ0FBQ2EsSUFBSSxDQUFDTixNQUFNLENBQUM7Z0JBQ2pEYztnQkFDQUM7Z0JBQ0FLLFNBQVM7b0JBQ1B0QixNQUFNO3dCQUNKcUIsVUFBVUE7b0JBQ1o7Z0JBQ0Y7WUFDRjtZQUVBLElBQUlwQixPQUFPO2dCQUNUaUIsUUFBUWpCLEtBQUssQ0FBQyxrQkFBa0JBO2dCQUNoQyxPQUFPO29CQUFFRCxNQUFNO29CQUFNQztnQkFBTTtZQUM3QjtZQUVBLE9BQU87Z0JBQUVEO2dCQUFNQyxPQUFPO1lBQUs7UUFDN0IsRUFBRSxPQUFPQSxPQUFPO1lBQ2RpQixRQUFRakIsS0FBSyxDQUFDLGtCQUFrQkE7WUFDaEMsT0FBTztnQkFBRUQsTUFBTTtnQkFBTUM7WUFBTTtRQUM3QjtJQUNGO0lBRUEsTUFBTUUsVUFBVTtRQUNkLElBQUk7WUFDRixNQUFNLEVBQUVGLEtBQUssRUFBRSxHQUFHLE1BQU1OLG1EQUFRQSxDQUFDYSxJQUFJLENBQUNMLE9BQU87WUFDN0MsSUFBSUYsT0FBTyxNQUFNQTtRQUNuQixFQUFFLE9BQU9BLE9BQU87WUFDZGlCLFFBQVFqQixLQUFLLENBQUMsbUJBQW1CQTtZQUNqQyxNQUFNQTtRQUNSO0lBQ0Y7SUFFQSxNQUFNc0IsUUFBUTtRQUNaMUI7UUFDQUM7UUFDQUM7UUFDQUc7UUFDQUM7SUFDRjtJQUVBLHFCQUNFLDhEQUFDUCxZQUFZNEIsUUFBUTtRQUFDRCxPQUFPQTtrQkFDMUJsQjs7Ozs7O0FBR1AsRUFBQztBQUVNLE1BQU1vQixVQUFVO0lBQ3JCLE1BQU1DLFVBQVVsQyxpREFBVUEsQ0FBQ0k7SUFDM0IsSUFBSThCLFlBQVlDLFdBQVc7UUFDekIsTUFBTSxJQUFJQyxNQUFNO0lBQ2xCO0lBQ0EsT0FBT0Y7QUFDVCxFQUFDIiwic291cmNlcyI6WyIvVXNlcnMvcmFkaWNhbHdpemFyZC9Eb2N1bWVudHMvR2l0SHViL3NoaXJ0Z2VuZXJhdG9yL2NvbXBvbmVudHMvQXV0aFByb3ZpZGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50J1xuXG5pbXBvcnQgeyBjcmVhdGVDb250ZXh0LCB1c2VDb250ZXh0LCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBzdXBhYmFzZSB9IGZyb20gJy4uL2xpYi9zdXBhYmFzZSdcblxuLy8gQ3JlYXRlIHRoZSBjb250ZXh0IHdpdGggYSBkZWZhdWx0IHZhbHVlXG5jb25zdCBBdXRoQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoe1xuICB1c2VyOiBudWxsLFxuICBsb2FkaW5nOiB0cnVlLFxuICBzaWduSW46IGFzeW5jICgpID0+ICh7IGRhdGE6IG51bGwsIGVycm9yOiBudWxsIH0pLFxuICBzaWduVXA6IGFzeW5jICgpID0+ICh7IGRhdGE6IG51bGwsIGVycm9yOiBudWxsIH0pLFxuICBzaWduT3V0OiBhc3luYyAoKSA9PiB7fSxcbn0pXG5cbmV4cG9ydCBjb25zdCBBdXRoUHJvdmlkZXIgPSAoeyBjaGlsZHJlbiB9KSA9PiB7XG4gIGNvbnN0IFt1c2VyLCBzZXRVc2VyXSA9IHVzZVN0YXRlKG51bGwpXG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAvLyBDaGVjayBhY3RpdmUgc2Vzc2lvbnMgYW5kIHNldHMgdGhlIHVzZXJcbiAgICBzdXBhYmFzZS5hdXRoLmdldFNlc3Npb24oKS50aGVuKCh7IGRhdGE6IHsgc2Vzc2lvbiB9IH0pID0+IHtcbiAgICAgIHNldFVzZXIoc2Vzc2lvbj8udXNlciA/PyBudWxsKVxuICAgICAgc2V0TG9hZGluZyhmYWxzZSlcbiAgICB9KVxuXG4gICAgLy8gTGlzdGVuIGZvciBjaGFuZ2VzIG9uIGF1dGggc3RhdGUgKHNpZ25lZCBpbiwgc2lnbmVkIG91dCwgZXRjLilcbiAgICBjb25zdCB7IGRhdGE6IHsgc3Vic2NyaXB0aW9uIH0gfSA9IHN1cGFiYXNlLmF1dGgub25BdXRoU3RhdGVDaGFuZ2UoKF9ldmVudCwgc2Vzc2lvbikgPT4ge1xuICAgICAgc2V0VXNlcihzZXNzaW9uPy51c2VyID8/IG51bGwpXG4gICAgICBzZXRMb2FkaW5nKGZhbHNlKVxuICAgIH0pXG5cbiAgICByZXR1cm4gKCkgPT4gc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKClcbiAgfSwgW10pXG5cbiAgY29uc3Qgc2lnbkluID0gYXN5bmMgKGVtYWlsLCBwYXNzd29yZCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zb2xlLmxvZygnQXR0ZW1wdGluZyB0byBzaWduIGluIHdpdGg6JywgZW1haWwpO1xuICAgICAgY29uc3QgeyBkYXRhLCBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC5zaWduSW5XaXRoUGFzc3dvcmQoe1xuICAgICAgICBlbWFpbCxcbiAgICAgICAgcGFzc3dvcmQsXG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgY29uc29sZS5sb2coJ1NpZ24gaW4gcmVzcG9uc2U6JywgeyBkYXRhLCBlcnJvciB9KTtcbiAgICAgIFxuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ1NpZ24gaW4gZXJyb3I6JywgZXJyb3IpO1xuICAgICAgICByZXR1cm4geyBkYXRhOiBudWxsLCBlcnJvciB9O1xuICAgICAgfVxuICAgICAgXG4gICAgICByZXR1cm4geyBkYXRhLCBlcnJvcjogbnVsbCB9O1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdTaWduIGluIGVycm9yOicsIGVycm9yKTtcbiAgICAgIHJldHVybiB7IGRhdGE6IG51bGwsIGVycm9yIH07XG4gICAgfVxuICB9XG5cbiAgY29uc3Qgc2lnblVwID0gYXN5bmMgKGVtYWlsLCBwYXNzd29yZCwgdXNlcm5hbWUpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgeyBkYXRhLCBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC5zaWduVXAoe1xuICAgICAgICBlbWFpbCxcbiAgICAgICAgcGFzc3dvcmQsXG4gICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICB1c2VybmFtZTogdXNlcm5hbWVcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdTaWduIHVwIGVycm9yOicsIGVycm9yKVxuICAgICAgICByZXR1cm4geyBkYXRhOiBudWxsLCBlcnJvciB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIHJldHVybiB7IGRhdGEsIGVycm9yOiBudWxsIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignU2lnbiB1cCBlcnJvcjonLCBlcnJvcilcbiAgICAgIHJldHVybiB7IGRhdGE6IG51bGwsIGVycm9yIH1cbiAgICB9XG4gIH1cblxuICBjb25zdCBzaWduT3V0ID0gYXN5bmMgKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB7IGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZS5hdXRoLnNpZ25PdXQoKVxuICAgICAgaWYgKGVycm9yKSB0aHJvdyBlcnJvclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdTaWduIG91dCBlcnJvcjonLCBlcnJvcilcbiAgICAgIHRocm93IGVycm9yXG4gICAgfVxuICB9XG5cbiAgY29uc3QgdmFsdWUgPSB7XG4gICAgdXNlcixcbiAgICBsb2FkaW5nLFxuICAgIHNpZ25JbixcbiAgICBzaWduVXAsXG4gICAgc2lnbk91dCxcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPEF1dGhDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9BdXRoQ29udGV4dC5Qcm92aWRlcj5cbiAgKVxufVxuXG5leHBvcnQgY29uc3QgdXNlQXV0aCA9ICgpID0+IHtcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoQXV0aENvbnRleHQpXG4gIGlmIChjb250ZXh0ID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUF1dGggbXVzdCBiZSB1c2VkIHdpdGhpbiBhbiBBdXRoUHJvdmlkZXInKVxuICB9XG4gIHJldHVybiBjb250ZXh0XG59ICJdLCJuYW1lcyI6WyJjcmVhdGVDb250ZXh0IiwidXNlQ29udGV4dCIsInVzZUVmZmVjdCIsInVzZVN0YXRlIiwic3VwYWJhc2UiLCJBdXRoQ29udGV4dCIsInVzZXIiLCJsb2FkaW5nIiwic2lnbkluIiwiZGF0YSIsImVycm9yIiwic2lnblVwIiwic2lnbk91dCIsIkF1dGhQcm92aWRlciIsImNoaWxkcmVuIiwic2V0VXNlciIsInNldExvYWRpbmciLCJhdXRoIiwiZ2V0U2Vzc2lvbiIsInRoZW4iLCJzZXNzaW9uIiwic3Vic2NyaXB0aW9uIiwib25BdXRoU3RhdGVDaGFuZ2UiLCJfZXZlbnQiLCJ1bnN1YnNjcmliZSIsImVtYWlsIiwicGFzc3dvcmQiLCJjb25zb2xlIiwibG9nIiwic2lnbkluV2l0aFBhc3N3b3JkIiwidXNlcm5hbWUiLCJvcHRpb25zIiwidmFsdWUiLCJQcm92aWRlciIsInVzZUF1dGgiLCJjb250ZXh0IiwidW5kZWZpbmVkIiwiRXJyb3IiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(pages-dir-node)/./components/AuthProvider.js\n");

/***/ }),

/***/ "(pages-dir-node)/./lib/supabase.js":
/*!*************************!*\
  !*** ./lib/supabase.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   supabase: () => (/* binding */ supabase)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/supabase-js */ \"@supabase/supabase-js\");\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__);\n\nconst supabaseUrl = \"https://nxbobmzmxnrkeakjelnd.supabase.co\";\nconst supabaseKey = \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54Ym9ibXpteG5ya2Vha2plbG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNTUyMTEsImV4cCI6MjA1OTgzMTIxMX0.I6UwyNfnLjMhprSjAFO0TmOp48x7Lw62zgP1HYS2PYw\";\nconst supabase = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(supabaseUrl, supabaseKey);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL2xpYi9zdXBhYmFzZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBb0Q7QUFFcEQsTUFBTUMsY0FBY0MsMENBQW9DO0FBQ3hELE1BQU1HLGNBQWNILGtOQUF5QztBQUV0RCxNQUFNSyxXQUFXUCxtRUFBWUEsQ0FBQ0MsYUFBYUksYUFBWSIsInNvdXJjZXMiOlsiL1VzZXJzL3JhZGljYWx3aXphcmQvRG9jdW1lbnRzL0dpdEh1Yi9zaGlydGdlbmVyYXRvci9saWIvc3VwYWJhc2UuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlQ2xpZW50IH0gZnJvbSAnQHN1cGFiYXNlL3N1cGFiYXNlLWpzJ1xuXG5jb25zdCBzdXBhYmFzZVVybCA9IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1NVUEFCQVNFX1VSTFxuY29uc3Qgc3VwYWJhc2VLZXkgPSBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19TVVBBQkFTRV9BTk9OX0tFWVxuXG5leHBvcnQgY29uc3Qgc3VwYWJhc2UgPSBjcmVhdGVDbGllbnQoc3VwYWJhc2VVcmwsIHN1cGFiYXNlS2V5KSAiXSwibmFtZXMiOlsiY3JlYXRlQ2xpZW50Iiwic3VwYWJhc2VVcmwiLCJwcm9jZXNzIiwiZW52IiwiTkVYVF9QVUJMSUNfU1VQQUJBU0VfVVJMIiwic3VwYWJhc2VLZXkiLCJORVhUX1BVQkxJQ19TVVBBQkFTRV9BTk9OX0tFWSIsInN1cGFiYXNlIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(pages-dir-node)/./lib/supabase.js\n");

/***/ }),

/***/ "(pages-dir-node)/./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _components_AuthProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/AuthProvider */ \"(pages-dir-node)/./components/AuthProvider.js\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../styles/globals.css */ \"(pages-dir-node)/./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/head */ \"(pages-dir-node)/./node_modules/next/head.js\");\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_3__);\n\n\n\n\nfunction MyApp({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_head__WEBPACK_IMPORTED_MODULE_3___default()), {\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"link\", {\n                        rel: \"icon\",\n                        href: \"/favicon.ico\"\n                    }, void 0, false, {\n                        fileName: \"/Users/radicalwizard/Documents/GitHub/shirtgenerator/pages/_app.js\",\n                        lineNumber: 9,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"title\", {\n                        children: \"Shirt Generator\"\n                    }, void 0, false, {\n                        fileName: \"/Users/radicalwizard/Documents/GitHub/shirtgenerator/pages/_app.js\",\n                        lineNumber: 10,\n                        columnNumber: 9\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"/Users/radicalwizard/Documents/GitHub/shirtgenerator/pages/_app.js\",\n                lineNumber: 8,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_AuthProvider__WEBPACK_IMPORTED_MODULE_1__.AuthProvider, {\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                    ...pageProps\n                }, void 0, false, {\n                    fileName: \"/Users/radicalwizard/Documents/GitHub/shirtgenerator/pages/_app.js\",\n                    lineNumber: 13,\n                    columnNumber: 9\n                }, this)\n            }, void 0, false, {\n                fileName: \"/Users/radicalwizard/Documents/GitHub/shirtgenerator/pages/_app.js\",\n                lineNumber: 12,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3BhZ2VzL19hcHAuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQXlEO0FBQzNCO0FBQ0Y7QUFFNUIsU0FBU0UsTUFBTSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBRTtJQUNyQyxxQkFDRTs7MEJBQ0UsOERBQUNILGtEQUFJQTs7a0NBQ0gsOERBQUNJO3dCQUFLQyxLQUFJO3dCQUFPQyxNQUFLOzs7Ozs7a0NBQ3RCLDhEQUFDQztrQ0FBTTs7Ozs7Ozs7Ozs7OzBCQUVULDhEQUFDUixrRUFBWUE7MEJBQ1gsNEVBQUNHO29CQUFXLEdBQUdDLFNBQVM7Ozs7Ozs7Ozs7Ozs7QUFJaEM7QUFFQSxpRUFBZUYsS0FBS0EsRUFBQSIsInNvdXJjZXMiOlsiL1VzZXJzL3JhZGljYWx3aXphcmQvRG9jdW1lbnRzL0dpdEh1Yi9zaGlydGdlbmVyYXRvci9wYWdlcy9fYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEF1dGhQcm92aWRlciB9IGZyb20gJy4uL2NvbXBvbmVudHMvQXV0aFByb3ZpZGVyJ1xuaW1wb3J0ICcuLi9zdHlsZXMvZ2xvYmFscy5jc3MnXG5pbXBvcnQgSGVhZCBmcm9tICduZXh0L2hlYWQnXG5cbmZ1bmN0aW9uIE15QXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfSkge1xuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8SGVhZD5cbiAgICAgICAgPGxpbmsgcmVsPVwiaWNvblwiIGhyZWY9XCIvZmF2aWNvbi5pY29cIiAvPlxuICAgICAgICA8dGl0bGU+U2hpcnQgR2VuZXJhdG9yPC90aXRsZT5cbiAgICAgIDwvSGVhZD5cbiAgICAgIDxBdXRoUHJvdmlkZXI+XG4gICAgICAgIDxDb21wb25lbnQgey4uLnBhZ2VQcm9wc30gLz5cbiAgICAgIDwvQXV0aFByb3ZpZGVyPlxuICAgIDwvPlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IE15QXBwXG4iXSwibmFtZXMiOlsiQXV0aFByb3ZpZGVyIiwiSGVhZCIsIk15QXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIiwibGluayIsInJlbCIsImhyZWYiLCJ0aXRsZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(pages-dir-node)/./pages/_app.js\n");

/***/ }),

/***/ "(pages-dir-node)/./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "@supabase/supabase-js":
/*!****************************************!*\
  !*** external "@supabase/supabase-js" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@supabase/supabase-js");

/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("(pages-dir-node)/./pages/_app.js")));
module.exports = __webpack_exports__;

})();