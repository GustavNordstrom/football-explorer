<template>
    <form @submit.prevent="handleLogin">
    <input
      type="text"
      v-model="username"
      placeholder="Username"
      required
    />
    <input
      type="password"
      v-model="password"
      placeholder="Password"
      required
    />
    <button type="submit">Login</button>
    <p>{{ message }}</p>
  </form>
</template>

<script>
export default {
    data() {
        return {
            username: "",
            password: "",
            message: "",
        };
    },
    methods: {
        async handleLogin(){
            try {
                const response = await fetch("http://localhost:3000/checkLogin", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: this.username,
                        password: this.password,
                    }),
                });

                const data = await response.json();

                if(response.ok) {
                    this.message = "Login successful";
                } else {
                    this.message = data.message || "Login failed";
                }

            } catch (error) {
                this.message = "Network or server error";
                console.error(error);
            }
        },
    },
};
</script>