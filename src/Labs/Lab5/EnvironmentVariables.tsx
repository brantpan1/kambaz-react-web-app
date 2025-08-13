const REMOTE_SERVER = import.meta.env.VITE_API_URL
export default function EnvironmentVariables() {
  return (
    <div id="wd-environment-variables">
      <h3>Environment Variables</h3>
      <p>Remote Server: {REMOTE_SERVER}</p>
      <hr />
    </div>
  )
}
