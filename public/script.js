document.getElementById("testForm2").addEventListener("submit", (e) => {
  e.preventDefault();
  const stock = e.target[0].value;
  const checkbox = e.target[1].checked;
  fetch(`/api/stock-prices/?stock=${stock}&like=${checkbox}`)
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("jsonResult").innerText = JSON.stringify(data);
    });
});

document.getElementById("testForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const stock1 = e.target[0].value;
  const stock2 = e.target[1].value;
  const checkbox = e.target[2].checked;
  fetch(`/api/stock-prices?stock=${stock1}&stock=${stock2}&like=${checkbox}`)
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("jsonResult").innerText = JSON.stringify(data);
    });
});

document.addEventListener("DOMContentLoaded", () => {
  const formSingle = document.getElementById("testForm2");
  const formMulti = document.getElementById("testForm");
  const jsonResult = document.getElementById("jsonResult");

  async function fetchStock(form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      let query = [];
      for (let [key, value] of formData.entries()) {
        if (key === "stock" && value) query.push(`stock=${value}`);
        if (key === "like" && value) query.push(`like=true`);
      }
      const queryString = query.join("&");
      const res = await fetch(`/api/stock-prices?${queryString}`);
      const data = await res.json();
      jsonResult.textContent = JSON.stringify(data, null, 2);
    });
  }

  fetchStock(formSingle);
  fetchStock(formMulti);
});
