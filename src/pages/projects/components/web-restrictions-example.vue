<template>
  <div class="prose text-sm">
    <ul>
      <li>
        Any URL in a single domain with no subdomains:
        <ul class="my-0">
          <li>https://example.com</li>
        </ul>
      </li>
      <li>
        Any URL in a single subdomain:
        <ul class="my-0">
          <li>https://sub.example.com</li>
        </ul>
      </li>
      <li>
        Any subdomain in a single domain, using a wildcard asterisk (*):
        <ul class="my-0">
          <li>https://*.example.com</li>
        </ul>
      </li>
      <li>
        A domain and all its subdomains, using a wildcard asterisk (*):
        <ul class="my-0">
          <li>https://example.com</li>
          <li>https://*.example.com</li>
        </ul>
      </li>
      <li>
        A URL with a non-standard port:
        <ul class="my-0">
          <li>http://www.example.com:8000</li>
        </ul>
      </li>
    </ul>
  </div>
</template>
