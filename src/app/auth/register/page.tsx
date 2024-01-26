const Register = () => {
  return (
    <div>
      <form action="/api/auth/register" method="post">
        <label>
          <b>Username</b>
          <input type="text" placeholder="Enter Username" name="username" />
        </label>
        <label>
          <b>Password</b>
          <input type="password" placeholder="Enter Password" name="password" />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default Register;
