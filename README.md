# bear-plugins

# Reply via Email Plugin

A small JavaScript plugin that adds a customizable **“Reply via email”** link to your blog posts.

## Parameters

|              | Required | Description                                      | Default              |
|--------------|----------|--------------------------------------------------|----------------------|
| `data-email` | Yes      | Email address used to create the `mailto:` link. | —                    |
| `data-text`  | No       | Text shown on the email link.                    | Reply via email      |

## Usage

```html
<script 
  src="https://cdn.jsdelivr.net/gh/melvinsalas/bear-plugins/plugins/reply.js"
  data-email="contact@example.com"
  data-text="Reply via email">
</script>
```

## Output

```html
<div class="reply-via-email-wrapper">
    <a class="reply-via-email" 
        href="mailto:contact@example.com?subject=Re:Title">
        Reply via email
    </a>
</div>
```