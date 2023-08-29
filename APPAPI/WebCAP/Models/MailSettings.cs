namespace WebCAP.Models
{
    public class MailSettings
    {
        public string Subject { get; set; }
        public string MailId { get; set; }
        public string Password { get; set; }
        public string SMTP { get; set; }
        public string Dear { get; set; }
        public string Body1 { get; set; }
        public string Regards { get; set; }

        public string RegardsName { get; set; }

        public int Port { get; set; }

    }
}
